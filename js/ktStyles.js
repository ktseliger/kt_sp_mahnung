const ktStyles = `
        fieldset{
            border-radius: 0.2rem;
            border: none;
            background-color: #eaf2ff !important;
            box-shadow: 1px 1px 4px black !important;
        }
        
        fieldset legend, fieldset legend:hover{
            background: #263938 !important;
            color: #e7e5e5 !important;
            padding: 1rem !important;
            font-variant: petite-caps !important;
            border-radius: 0.2rem !important;
            margin-top: 0 !important;
            border-bottom-right-radius: 0 !important;
            border-bottom-left-radius: 0 !important;
            border: none !important;
            cursor: default !important;
        }
                
        fieldset legend i{
                display: none !important;
        }
        
        [id^="descHL_"]{
            font-size: 0.9rem;
            font-weight: bold;
            text-wrap-mode: nowrap;
            padding-bottom: 1.5rem;
        }
        
        [id*="txtUL"]{
            text-decoration: underline;
        }
        
        .jr-step-dialog-tab-link.jr-tab-link.active {
            color: #222;
            border-bottom-color: #222;
        }
        
        li.jr-tab{
                background-color: #263938;
                box-shadow: -1px -1px 4px white;
                border-top-left-radius: .2rem;
                border-top-right-radius: .2rem;
        }
        
        li.jr-tab a{
                color: white !important;
        }
        
        li.jr-tab:has(a.active){
                background-color: #b93737;
        }
        
        li.jr-tab a.active {
            color: white !important;
        }
        
        .jr-tab-link {
            border-bottom: 3px solid rgba(0, 0, 0, 0);
            color: #222;
            display: block;
            margin: 0 .1rem;
            padding: 12px;
            text-decoration: none;
            transition: border-bottom-color .3s;
            white-space: nowrap;
        }
        
        ul#jr-step-dialog-tabs{
                height: 3.5rem;
                padding-top: 1rem;
        }
        
        div.jr-tab-content {
                padding-top: 1.5rem;
        }
        
        td.jr-dialog-col-container {
                padding: 1rem;
        }
        
        header{
                background-color: #263938;
                padding-bottom: 1rem !important;
                padding-top: 1rem !important;
                height: auto !important;
                border-bottom: black;
                box-shadow: 1px 0px 4px black;
                background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(230, 230, 230, 1) 100%, rgba(166, 166, 166, 1) 100%) !important;
        }
        
        button, textarea, input, select {
               border-radius: .1rem !important;
        }
        
        table.colContainer td.col:nth-child(n+2) {
                border-left: 1px solid silver !important;
        }
        
        table.rowContainer:first-child table.row {
                margin-top: 18px;
        }
        
        button[id^="showPositions_"], 
        button[id^="showPositions_"]:hover, 
        button[id^="showPositions_"]:focus,
        button[id^="showPositions_"]:active {
                font-family: JrIcons;
                border: none;
                box-shadow: none;
                background: unset;
                outline: none;
                font-size: large;
                padding-top: 0;
                padding-bottom: 0;
        }
        
        button[id^="showPositions_"][readonly],
        button[id^="showPositions_"]:disabled{
                pointer-events: none;
                background-color: unset !important;
                color: silver !important;
        }
        
        div[role="dialog"]{
            box-shadow: 1px 1px 4px black;
            border-radius: .2rem;
        }

        div.ui-dialog-titlebar{
            background-color: #131c1c;
            color: white;
        }

        span.ui-icon-closethick{
        background-color: white;
        }
`;