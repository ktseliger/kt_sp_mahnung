<?php
        spl_autoload_register(static function ($class) {
                
                $prefixes = [
                        'App\\' => __DIR__ . '/src/',
                        'Smalot\\PdfParser\\' => __DIR__ . '/vendor/smalot/pdfparser/src/Smalot/PdfParser/',
                        'Kaitech\\' => __DIR__ . '/vendor/kaitech/src/'
                ];
                
                foreach($prefixes as $prefix => $baseDir) {
                        
                        if (strncmp($class, $prefix, strlen($prefix)) !== 0) {
                                continue;
                        }
                        
                        $relativeClass = substr($class, strlen($prefix));
                        $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';
                        
                        if (file_exists($file)) {
                                require $file;
                        }
                }
        });