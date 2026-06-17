class ktLib{

        dateFormatGerman(dateString){

                if(!(dateString && typeof dateString === 'string')){
                        throw new Error('dateString must be a string');
                }

                let datum = new Date(dateString);

                return datum.toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        timeZone: 'Europe/Berlin'
                })
        }
        stylePage(){

                const styleNode = document.createElement('style');
                styleNode.textContent = ktStyles;
                document.head.appendChild(styleNode);
        }

        makeInfoToHelp(){

                const icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEKElEQVR4nO2az29VRRTHP8VKKxChpYA7YUGU1Cj/gLoxSFEQcIXWhQkGEpEfRUUXCombpsKGhITExJUbNoQghAAJ2AhGfljBBVAqCwLoQlKikUKD5pETv5eclHcv786d+14lfJObvHZmzsy5c+bMd75z4REeXrQDS4Evgf3ABWAYGNVjv8+rzOq8AbQxTtAKvAMcAv4FKjmff4CDQDfQ0ggHngA2Ar+5Qd0GjgCfaWbm6Y0/rqdN/7Oyz4GjapO0vwb06OXUBa8Bl9wATgErgakBtqYB7wGnnb1fgS5KhL2pna7Dn4AFEe0vBH529neUMTtPaeDWwU3gA+Cx2J3wn811wIib7VmxjM/RdFeUdZ6jfDwPDKrPIY2hEGY4gyeBDuqHNuCY+r6kqAhCqwunH4DJ1B+TgR9dmAWtmZ0unGyzaxSmu6iwBJA7xSYLO3RNTFImWgtsAt4Fni2wZkY0JrNZ82aX7BOWnUIyz6fAjZTd/HvghQC7693irynEPnT7RN4U2wzsroGa2Nt9OcD2GbU3pzLR6mhHyGa3acyAjbKsER/bBvztyn4HpuS036W2Vx/EzbpdhghZE8NuoMZwx+IZ4C9XZ3XOPppcJn0rq+IhVTLulBeL3AAvKxSqodfV2xXQzyq1PZBWoV20+nYgAXxRlPxaymwkWOEc6Q/cKEeBO2njXOriukyscY7sCbTxndovqVa4VYV2nigLE0R1Ekc+CrSzRe37qhXuz/IyEt53TlgGmxloZ5ls7K1WeFGFdoorA08DfzpHPi5gq1M2TBe4D9dVaNwmNpodk63od5HzTIfs/FGtcFSFE4mPL5wTRl1mF7TX4nSCujnyktJ64sibEWy2ZDlSRmhZ+PzinPgqkt2OrNAqY7H73X444rmmM2ux71OhKYCxsME5kkopYqffrSo08SwWPnGOfB3R7pasDTGhKKYAxnxzh/UYNYmFfo11cRoZS0ijKYDjFe2OND6ZVumgPDUZc7xitcZolCoVb6uSabEx8LrOH70SH4qiCRjQGO04kLnRXFXFVyN0/M0YsTvGi6kAV2q5huhR5YEI+m5MR5qBs7JlEhO1CBCJ1muC8nhxpEd2BvNcCnU52cbEsVDMBV7RE6JlJZgP3ApVd3a4N1AGtc8jpA9pLNtDDLQqHCoSkhshYk8BTmgMJ4rcM84QMUuuFezvem58x911XOELnzluagcLxnqeNTGkPi9GOIjdwywXZiPSXtMEuCJoVna65cIpVKDIXDNJAqhIUI51+9qkq4yzzv72su/eF7ppT1T7VYFfMbSLOyW0o6JQinlb/MDZWe/oTEWM1Oj1ZtH3TqXtiXqm69Jouer0O50goR1rG/UFRItU8QNjBIZanztisSsa5UA1TNVBx05t3+ru8br7qMZ+n9PxtE91U88Tj8D/HHcB4Ep1TRRxjn8AAAAASUVORK5CYII=";

                jQuery('table.page input[type!="hidden"][type!="file"], table.page button.jr-file-upload')
                        .filter((_, el) => el.title && el.title.trim() !== '' && el.id)
                        .each((_, el) => {
                                const $el = jQuery(el);
                                const id = el.id;
                                const title = el.title.trim();

                                const $tr = $el.closest('tr');

                                // Icon schon vorhanden?
                                if ($tr.find(`#help_${id}`).length > 0) return;

                                // <td> mit Icon erzeugen
                                const $helpTd = jQuery(`
                                    <td class="jr-dialog-form-label-wrapper" style="padding: 2px 0;">
                                      <img id="help_${id}" src="${icon}" 
                                           style="height: auto; max-width: 20px; cursor: pointer; margin-left: .3em;" 
                                           title="Hilfe anzeigen" alt="">
                                    </td>
                              `);

                                $tr.append($helpTd);

                                // Klick auf Icon zeigt Dialog
                                $helpTd.find('img').on('click', () => {

                                        let labelText = '';

                                        // 1. Versuch: Standardlabel anhand "for"-Attribut
                                        const $label = $tr.find(`label[for="${id}"]`);

                                        if ($label.length) {
                                                labelText = $label.text().trim();
                                        }
                                        else {
                                                // 2. Versuch: Buttons → Label mit verwandter ID suchen
                                                const baseId = id.split('_')[0];
                                                const $labelById = jQuery(`#${baseId}_label`);

                                                if ($labelById.length) {
                                                        labelText = $labelById.text().trim();
                                                }
                                                else {
                                                        // 3. Fallback: Nur Titel anzeigen
                                                        labelText = '';
                                                }
                                        }

                                        const dialogTitle = labelText
                                                ? `Hilfetext: ${labelText.replace(/:$/, '')}`
                                                : 'Hilfetext';

                                        //Zeigen des Popups
                                        jQuery('#popup').css('position', 'relative') //Relativ, da Container sonst nicht korrekt wrappt
                                                .empty() // Erstmal leeren, um evtl. vorhandene Altlasten zu entfernen
                                                .append(`<div>${title}</div>`) // Den Inhalt setzen
                                                .dialog({ // Das Popup schlussendlich zeigen
                                                        modal: false, // Nicht modal, damit die Seite weiter bedient werden kann
                                                        title: dialogTitle, // Setzen des Titels
                                                        closeOnEscape: true, // Wenn ESC gedrückt wird, Popup schließen
                                                        close: () => jQuery('#popup').empty(), // Beim Schließen leeren
                                                        show: { // Animation für das Öffnen
                                                                effect: 'fadeIn',
                                                                duration: 500
                                                        },
                                                        hide: { // Animation für das Schließen
                                                                effect: 'fadeOut',
                                                                duration: 500
                                                        }
                                                })
                                                .parent()
                                                .css({ // Den umgebenden Container stylen
                                                        'box-shadow': '1px 1px 4px rgba(0,0,0,.3)',
                                                        'background-color': 'rgb(210 233 255)'
                                                });
                                });
                        });
        }
}