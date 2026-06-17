# Funktionen zur Einbindung in die JobRouter-Dialoge

Diese Funktionen werden als globale Scripte in die JobRouter-Dialoge eingebunden.
Die Dateien haben dabei unterschiedliche Aufgaben:
- ktStyles.js: Stellt die CSS-Klassen für die Dialoge bereit
- ktLib.js: Stellt allgemeine (Hilfs-)Funktionen bereit
- ktDialog.js: Stellt die zentrale Komponente dar

Eingebunden wird die Bibliothek in den Dialogeinstellungen bei den Event-Handlern onload und onsubmit.  
Damit die Klasse $KTDIALOG instantiiert werden kann, muss im onload-Handler folgender Aufruf hinterlegt sein: 
`glbalThis.$KTDIALOG = new ktDIALOG();`

Damit eventuell vorhandene Funktionen beim Senden des Dialogs ausgeführt werden,  
muss zusätzlich im onsubmit-Handler folgender Aufruf hinterlegt sein: `$KTDIALOG.submit();`
