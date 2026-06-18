<?php

namespace App\RuleConditionFunctions;

use JobRouter\Engine\Runtime\PhpFunction\RuleConditionFunction;
use JobRouterException;
use Kaitech\JobRouterConfig\Config;

class positionExists {

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

                $position = $this->class->getTableValue('beleg_nummer');

                if(!$position){
                        return true;
                }

                foreach($this->class->getSubtableRowIds($this->config->get('subtable_related_incidents')) as $rowID){

                        if($this->class->getSubtableValue($this->config->get('subtable_related_incidents'), $rowID, 'pos_nummer') === $position){
                                return true;
                        }
                }
                return false;
        }
}