const ktDialogConfig = {
    run: {
        default: [
            'stylePage',
            'makeInfoToHelp',
            'deactLegendClick'
        ],
        50: [
                'disableButtonsNoIncident',
                'activatePopups',
                'setCSSClasses'
        ]
    },
    submit: {}
};

class ktDialogBase {

    dialogID = undefined;
    static runFuncs;
    static run = {};
    static submit = {};

    constructor(dialogID) {

        if(typeof ktLib === "function"){
            globalThis.$KTLIB = new ktLib();
        }

        let jrstep;

        if(globalThis.hasOwnProperty('$JRSTEP') && $JRSTEP.hasOwnProperty('step')){
            jrstep = $JRSTEP.step;
        }

        if((!dialogID || typeof dialogID !== 'number') && !jrstep){
            throw new Error('Dialog ID is not defined');
        }

        this.dialogID = dialogID || jrstep;
        this.getRunMethods();
        this.run();
    }

    getRunMethods() {

        let proto = Object.getPrototypeOf(this);
        ktDialog.runFuncs = [];

        while (proto && proto !== Object.prototype) {
            Object.getOwnPropertyNames(proto)
                    .filter(prop => typeof this[prop] === 'function')
                    .forEach(method => {
                        if (/^__(run|submit)__\d+$/.test(method)) {
                            ktDialog.runFuncs.push(method);
                        }
                    });

            proto = Object.getPrototypeOf(proto);
        }
    }

    run(){

        //Führt die Standard-Funktionen bei Initialisierung aus
        if(this.constructor.hasOwnProperty('run') && this.constructor.run.hasOwnProperty('default')){
            this.constructor.run['default'].forEach(method => {
                typeof this[method] === 'function' && this[method]();
            });
        }

        //Führt die spezifischen Funktionen bei Initialisierung aus
        if(this.constructor.hasOwnProperty('run') && this.constructor.run.hasOwnProperty(this.dialogID)){
            this.constructor.run[this.dialogID].forEach(method => {
                typeof this[method] === 'function' && this[method]();
            });
        }

        //Führt spezifischen Code bei Initialisierung aus
        if(this.constructor.runFuncs.includes("__run__" + this.dialogID)){
            typeof this[`__run__${this.dialogID}`] === 'function' && this[`__run__${this.dialogID}`]();
        }
    }

    submit(){

        //Führt die Standard-Funktionen beim Absenden aus
        if(this.constructor.hasOwnProperty('submit') && this.constructor.submit.hasOwnProperty('default')){
            this.constructor.submit['default'].forEach(method => {
                typeof this[method] === 'function' &&this[method]();
            });
        }

        //Führt die spezifischen Funktionen beim Absenden aus
        if(this.constructor.hasOwnProperty('submit') && this.constructor.submit.hasOwnProperty(this.dialogID)){
            this.constructor.submit[this.dialogID].forEach(method => {
                typeof this[method] === 'function' &&this[method]();
            });
        }

        //Führt spezifischen Code beim Absenden aus
        if(this.constructor.runFuncs.includes("__submit__" + this.dialogID)){
            typeof this[`__submit__${this.dialogID}`] === 'function' && this[`__submit__${this.dialogID}`]();
        }
    }
}

class ktDialog extends ktDialogBase{
    constructor(dialogID) {
        ktDialog.run = ktDialogConfig.run;
        ktDialog.submit = ktDialogConfig.submit;
        super(dialogID);
    }

    stylePage(){
        $KTLIB.stylePage();
    }

    makeInfoToHelp(){
        $KTLIB.makeInfoToHelp();
    }

    deactLegendClick(){

        document.addEventListener('click', event => {
            if (event.target.closest('legend')) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        }, true);
    }

    disableButtonsNoIncident(){

        document.querySelectorAll('button[id^="showPositions_"]').forEach(elem => {

            const matches = elem.id.match(/showPositions_.+(\d+)$/);

            if(matches && !document.querySelector(`#showPositions_zug_vorgang_${matches[1]}`).innerHTML.trim()){
                elem.disabled = true;
            }
        });

    }

    activatePopups(){

        document.querySelector('table#showPositions').addEventListener('click', e => {

            const histMatch = e.target.id.match(/showPositions_show_history_(\d+)$/);
            const bemMatch  = e.target.id.match(/showPositions_show_bemerkungen_(\d+)$/);

            if(!(histMatch || bemMatch)){
                return;
            }

            //Anzeigen des Vorgangsverlaufs
            if(histMatch && document.querySelector(`#showPositions_zug_vorgang_${histMatch[1]}`).innerHTML.trim()) {

                const index = histMatch[1];
                const value = jr_get_value(`showPositions_rel_prozessid_${index}`);
                jr_set_value('rel_prozessid', value);
                jr_sql_refresh('historie', e => {

                    const parent = $j('div#historie').parent();
                    const histElem = $j('div#historie').detach();
                    this.showPopup(parent, histElem, 'Verlauf');
                });
            }

            //Anzeigen der Bemerkungen
            if(bemMatch && document.querySelector(`#showPositions_zug_vorgang_${bemMatch[1]}`).innerHTML.trim()) {
                const index = bemMatch[1];
                const value = jr_get_value(`showPositions_rel_bemerkungen_${index}`);
                jr_set_value('rel_bemerkungen', value);
                const parent = $j('div#rel_bemerkungen').parent();
                const bemElem = $j('div#rel_bemerkungen').detach();
                console.log(bemElem);
                this.showPopup(parent, bemElem, 'Bemerkungen');
            }
        });
    }

    showPopup(parent, child, title){
        console.log('Zeige Popup');
        $j('#popup').append(child);
        $j('#popup').css('position', 'relative');

        $j('#popup').dialog({
            title: title,
            open: () => {
            },
            close: () => {
                $j(child).detach().appendTo(parent);
            },
            modal: true,
            position: { my: "center", at: "center", of: window },
            resize: false,
            width: '40%'
        });
    }

    setCSSClasses(){

        document.querySelectorAll('tbody tr[id^="div_showPositions_"]').forEach(trElem => {

            const matches = trElem.id.match(/_(\d+)$/);

            if(!matches){ return; }

            const index = matches[1];

            "[jrc_step_flag_css_classes]".split(',').map(e => { return e.trim() }).forEach(c => {

                if(!!Number(jr_get_value(`showPositions_rel_${c}_${index}`))){
                    trElem.addClassName(c);
                }
            });
        });
    }
}
