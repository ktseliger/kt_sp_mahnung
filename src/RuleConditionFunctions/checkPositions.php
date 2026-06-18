<?php

namespace App\RuleConditionFunctions;

use JobRouter\Engine\Runtime\PhpFunction\RuleConditionFunction;
use JobRouterException;
use Kaitech\JobRouterConfig\Config;

class checkPositions {

        private RuleConditionFunction $class;
        private Config $config;

        /**
         * @param RuleConditionFunction $class
         * @return bool
         * @throws JobRouterException
         */
        public static function handle(RuleConditionFunction $class): bool {
                $checkPositions = new self($class);
                return $checkPositions->execute();
        }

        /**
         * @param RuleConditionFunction $class
         * @throws JobRouterException
         */
        public function __construct(RuleConditionFunction $class){

                $this->class = $class;
                $this->config = Config::getInstance($class);
        }

        /**
         * @throws JobRouterException
         */
        private function execute(): bool {

                foreach($this->class->getSubtableRowIds($this->config->get('subtable_related_incidents')) as $rowID){

                        if(!$this->class->getSubtableValue($this->config->get('subtable_related_incidents'), $rowID, 'pos_nummer')){
                                return false;
                        }
                }

                if(!($this->class->getSubtableCount($this->config->get('subtable_related_incidents')) || $this->class->getTableValue('beleg_nummer'))){
                        return false;
                }

                return true;
        }
}