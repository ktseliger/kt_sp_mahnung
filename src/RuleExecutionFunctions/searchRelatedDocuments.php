<?php

namespace App\RuleExecutionFunctions;

use JobRouter\Common\Database\ConnectionInterface;
use JobRouter\Engine\Runtime\PhpFunction\RuleExecutionFunction;
use JobRouterException;
use Kaitech\JobRouterConfig\Config;

class searchRelatedDocuments {

        private RuleExecutionFunction $class;
        private Config $config;
        private ConnectionInterface $dbh;

        /**
         * @param RuleExecutionFunction $class
         * @throws JobRouterException
         */
        public static function handle(RuleExecutionFunction $class): void {
                new self($class);
        }

        /**
         * @param RuleExecutionFunction $class
         * @throws JobRouterException
         */
        public function __construct(RuleExecutionFunction $class){

                $this->class  = $class;
                $this->config = Config::getInstance($class);
                $this->dbh    = $class->getJobDB();
                $this->execute();
                //throw new JobRouterException("FuncFin");
        }

        /**
         * @throws JobRouterException
         */
        private function execute(): void {

                foreach($this->class->getSubtableRowIds($this->config->get('subtable_related_incidents')) as $rowId){

                        $docNo = $this->class->getSubtableValue($this->config->get('subtable_related_incidents'), $rowId, 'pos_nummer');

                        if(($processValues = $this->getLastPTEntry($docNo)) === null || !count($processValues ?? [])) {
                                continue;
                        }

                        foreach([
                                'rel_akt_schritt'       => $processValues['step'],
                                'rel_akt_schritt_bez'   => $processValues['steplabel'],
                                'rel_prozessid'         => $processValues['processid'],
                                'rel_vorgang'           => $processValues['incident'],
                                'rel_bemerkungen'       => $processValues[$this->config->get('process_er_notes_field')] ,
                                'rel_weiterleiten'      => $processValues[$this->config->get('process_er_forward_field')]
                        ] as $k => $v){
                                $this->class->setSubtableValue($this->config->get('subtable_related_incidents'), $rowId, $k, $v);
                        }

                        $this->class->attachFile(
                                $this->class->getFullUploadPath(
                                        $processValues[$this->config->get('process_er_file_field')]
                                ),
                                'rel_file',
                                $rowId,
                                $this->config->get('subtable_related_incidents')
                        );

                        $this->setFlags($processValues['processid'], $rowId);
                }
        }

        /**
         * @param string $docNo
         * @return array|null
         * @throws JobRouterException
         */
        private function getLastPTEntry(mixed $docNo): array|null {

                $sql = "
                    select i.incident, ii.step, ii.steplabel, i.processid, 
                        p.".$this->config->get('process_er_file_field').",
                        p.".$this->config->get('process_er_forward_field').",
                        p.".$this->config->get('process_er_notes_field')."
                        from JRINCIDENT i
                            inner join JRINCIDENTS ii
                                on i.processid = ii.processid
                            inner join ".$this->config->get('process_table')." p
                                on ii.process_step_id = p.step_id
                        where
                            i.processname = '".$this->config->get('process_name_er')."'
                                and p.".$this->config->get('process_er_search_field')." = :docNo
                                and (
                                    (i.status < 5 and ii.status < 3)
                                    or
                                    (i.status >= 5 and ii.outdate = (
                                        select max(ii2.outdate)
                                            from JRINCIDENTS ii2
                                        where ii2.process_step_id = p.step_id
                                    ))
                                )
                ";

                if(($result = $this->dbh->preparedSelect($sql, [':docNo' => $docNo], [ConnectionInterface::TYPE_TEXT])) === false){
                        throw new JobRouterException("Error executing SQL query: ".$this->dbh->getErrorMessage());
                }

                return $this->dbh->fetchRow($result);
        }

        /**
         * @param string $processid
         * @param int $rowId
         * @throws JobRouterException
         */
        private function setFlags(string $processid, int $rowId): void {

                $prefix = 'er_proc_step_';

                foreach($this->config->allStartsWith($prefix) as $k => $step){

                        $flagName = substr($k, strlen($prefix));
                        $sql = "SELECT COUNT(*) FROM JRINCIDENTS WHERE processid = :processid AND step = :step";

                        $params = [
                                ':processid' => $processid,
                                ':step'      => $step
                        ];

                        $types = [
                                ConnectionInterface::TYPE_TEXT,
                                ConnectionInterface::TYPE_INTEGER
                        ];

                        if(($result = $this->dbh->preparedSelect($sql, $params, $types)) === false){
                                throw new JobRouterException("Error executing SQL query: ".$this->dbh->getErrorMessage());
                        }

                        $this->class->setSubtableValue($this->config->get('subtable_related_incidents'), $rowId, "rel_{$flagName}", (int)(bool)$this->dbh->fetchOne($result));
                }

        }
}