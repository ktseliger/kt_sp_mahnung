<?php

namespace App\RuleExecutionFunctions;

use JobRouter\Common\Database\ConnectionInterface;
use JobRouter\Engine\Runtime\PhpFunction\RuleExecutionFunction;
use JobRouterException;
use Kaitech\JobRouterConfig\Config;

class initProcess {

        private Config $config;
        private ConnectionInterface $dbh;
        private RuleExecutionFunction $class;

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

                $this->config = Config::getInstance($class);
                $this->dbh      = $class->getJobDB();
                $this->class    = $class;

                $this->execute();
        }

        /**
         * @return void
         * @throws JobRouterException
         * ###########################
         * # Hauptlogik der Funktion #
         * ###########################
         */
        private function execute(): void {

                $this->setCurrentDate();
                $this->setUserDefinedFields();
        }

        /**
         * @return void
         * @throws JobRouterException
         */
        private function setUserDefinedFields(): void {

                $settingName = 'user_defined_fields';

                if(!$this->config->has($settingName) || !preg_match('/^(1):([^|]+)(?:\|(2):([^|]+))?$/', $this->config->get($settingName), $matches)){
                        return;
                }

                for($i = 1; $i < count($matches); $i+=2){
                        $this->class->setTableValue('user_defined_'.$matches[$i], $this->class->getTableValue($matches[$i+1]));
                }
        }

        /**
         * @throws JobRouterException
         */
        private function setCurrentDate(): void {
                $this->class->setTableValue('datum_eingang', date("Y-m-d H:i:s"));
        }
}