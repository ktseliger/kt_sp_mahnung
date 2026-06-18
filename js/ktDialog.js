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

    static run = {};
    static submit = {};
    static hookMethods = [];

    constructor(dialogID) {

        this.initKtLib();
        this.dialogID = this.resolveDialogID(dialogID);
        this.collectHookMethods();
        this.run();
    }

    initKtLib() {

        if (typeof ktLib === 'function' && !globalThis.$KTLIB) {
            globalThis.$KTLIB = new ktLib();
        }
    }

    resolveDialogID(dialogID) {
        const jrstep = globalThis.$JRSTEP?.step;

        const resolvedID = dialogID ?? jrstep;

        if (resolvedID === undefined || resolvedID === null || resolvedID === '') {
            throw new Error('Dialog ID is not defined');
        }

        const numericID = Number(resolvedID);

        if (!Number.isInteger(numericID)) {
            throw new Error(`Dialog ID "${resolvedID}" is not a valid integer`);
        }

        return numericID;
    }

    collectHookMethods() {
        const methods = new Set();
        let proto = Object.getPrototypeOf(this);

        while (proto && proto !== ktDialogBase.prototype) {

            Object.getOwnPropertyNames(proto)
                    .filter(name => /^__(run|submit)__\d+$/.test(name))
                    .filter(name => typeof this[name] === 'function')
                    .forEach(name => methods.add(name));

            proto = Object.getPrototypeOf(proto);
        }

        this.constructor.hookMethods = [...methods];
    }

    run() {
        this.executeDialogMethods('run');
    }

    submit() {
        this.executeDialogMethods('submit');
    }

    executeDialogMethods(type) {
        const config = this.constructor[type] ?? {};

        this.executeMethodList(config.default);
        this.executeMethodList(config[this.dialogID]);
        this.executeHook(type);
    }

    executeMethodList(methods) {

        if (!Array.isArray(methods)) {
            return;
        }

        methods.forEach(method => {

            if (typeof this[method] === 'function') {
                this[method]();
            } else {
                console.warn(`Configured method "${method}" does not exist.`);
            }
        });
    }

    executeHook(type) {

        const hook = `__${type}__${this.dialogID}`;

        if (
                this.constructor.hookMethods.includes(hook) &&
                typeof this[hook] === 'function'
        ) {
            this[hook]();
        }
    }
}

class ktDialog extends ktDialogBase{

    static run = ktDialogConfig.run;
    static submit = ktDialogConfig.submit;
    constructor(dialogID) {
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
                const link = jr_get_value(`showPositions_rel_history_${index}`);
                const iframe = document.getElementById('rel_history');
                const parent = iframe.parentElement;
                iframe.src = link;
                this.showPopup(parent, iframe, "Verlauf", "auto", "auto");
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

    showPopup(parent, child, title, width, height){

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
            width: width || '40%',
            height: height || 'auto'
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
