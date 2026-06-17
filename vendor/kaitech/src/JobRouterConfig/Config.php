<?php

namespace Kaitech\JobRouterConfig;

use JobRouter\Common\Database\ConnectionInterface;
use JobRouter\Engine\Runtime\PhpFunction\DialogFunction;
use JobRouter\Engine\Runtime\PhpFunction\RuleConditionFunction;
use JobRouter\Engine\Runtime\PhpFunction\RuleExecutionFunction;
use JobRouterException;

class Config {

        private RuleExecutionFunction|DialogFunction|RuleConditionFunction $class;
        private ConnectionInterface $dbh;
        private array $settings;

        /**
         * @param RuleExecutionFunction|DialogFunction|RuleConditionFunction $class
         * @return Config
         * @throws JobRouterException
         */
        public static function getInstance(RuleExecutionFunction|DialogFunction|RuleConditionFunction $class): self {
                return new self($class);
        }

        /**
         * @param RuleExecutionFunction|RuleConditionFunction|DialogFunction $class
         * @throws JobRouterException
         */
        public function __construct(RuleExecutionFunction|RuleConditionFunction|DialogFunction $class) {

                $this->class    = $class;
                $this->dbh      = $class->getJobDB();
                $this->settings = [];

                $this->readConfig();
        }

        /**
         * @return void
         * @throws JobRouterException
         */
        private function readConfig(): void {

                $sql = "SELECT setting FROM JRPROCESSCONFIGURATION WHERE processname = :processname AND version = :version";
                $params = [
                        ':processname' => $this->class->getProcessName(),
                        ':version'     => $this->class->getVersion(),
                ];

                $types = [
                        ConnectionInterface::TYPE_TEXT,
                        ConnectionInterface::TYPE_INTEGER
                ];

                if(($result = $this->dbh->preparedSelect($sql, $params)) === false){
                        throw new JobRouterException($this->dbh->getErrorMessage());
                }

                foreach($this->dbh->fetchCol($result) as $setting){
                        $this->settings[$setting] = $this->class->getConfiguration($setting);
                }
        }

        /**
         * @param string $setting
         * @return mixed
         * @throws JobRouterException
         */
        public function get(string $setting): mixed {

                if(!isset($this->settings[$setting])){
                        throw new JobRouterException("Setting {$setting} not found in process configuration.");
                }

                return $this->settings[$setting];
        }

        /**
         * @param string $setting
         * @return bool
         */
        public function has(string $setting): bool {
                return isset($this->settings[$setting]);
        }
}