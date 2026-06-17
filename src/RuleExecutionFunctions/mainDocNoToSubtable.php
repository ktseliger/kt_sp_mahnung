<?php

namespace App\RuleExecutionFunctions;

use JobRouter\Engine\Runtime\PhpFunction\RuleExecutionFunction;
use JobRouterException;
use Kaitech\JobRouterConfig\Config;

class mainDocNoToSubtable {

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

                $docNo = $this->class->getTableValue('beleg_nummer');
                $rowID = $this->class->getSubtableCount($this->config->get('subtable_related_incidents'));
                $this->class->setSubtableValue($this->config->get('subtable_related_incidents'), $rowID + 1, 'pos_nummer', $docNo);
        }
}