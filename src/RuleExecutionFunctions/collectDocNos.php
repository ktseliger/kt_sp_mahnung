<?php

namespace App\RuleExecutionFunctions;

use JobRouter\Engine\Runtime\PhpFunction\RuleExecutionFunction;
use JobRouterException;
use Kaitech\JobRouterConfig\Config;

class collectDocNos {

        private RuleExecutionFunction $class;
        private Config $config;

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
                $this->class = $class;
                $this->config = Config::getInstance($class);
                $this->execute();
        }

        /**
         * @throws JobRouterException
         */
        private function execute(): void {

                $rowIDs = $this->class->getSubtableRowIds($this->config->get('subtable_related_incidents'));
                $docNos = [];

                foreach($rowIDs as $rowID){
                        $docNos[] = $this->class->getSubtableValue($this->config->get('subtable_related_incidents'), $rowID, 'pos_nummer');
                }

                $docNos = substr(implode(',', array_filter(array_unique($docNos))), 0, 255);
                $this->class->setTableValue('arc_beleg_nr_ext', $docNos);
        }
}