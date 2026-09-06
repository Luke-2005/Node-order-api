## How to Run

1. Starte den Server über das Terminal in dem Projektordner:
    ```bash
    cd .\wmk-take-home-task-luke\
    node index.js
    ```

2. Der Server läuft auf http://localhost:8080.

## Testing:
Die Api kann in VS Code mit über die Mitgelieferte Datei `requests.http` (mithilfe der Extension REST Client) getestet werden.

## Annahmen:
1. **ID-Vergabe:** Neue IDs werden fortlaufend als Zahlen auf Basis der bisher höchsten existierenden ID generiert.
2. **Total:** Der Gesamtpreis wird bei jeder Aktion berechnet und in der API-Antwort mit ausgegeben, aber nicht in der `orders.json` gespeichert.
3. **Fehlerbehandlung:** Wenn die `orders.json` nicht existiert oder leer ist, fängt der Server dies ab und gibt ein leeres Array zurück.

## Input Validation:
1. **Typ und Wertprüfung:** Der Preis der Artikel muss eine positiv Zahl sein und die Quantität eine positive ganze Zahl.
2. **Pflichtfelder und Enums:** Prüfen, ob items ein nicht leeres Array ist und bei der PUT-Request nur erlaubte Statuswerte zulassen.
3. **JSON Parsing:** Abfangen von fehlerhaften JSON-Code, damit der Server nicht abstürzt.


## Migration zu einer Datenbank:
1. Gleichzeitiger und schnellerer Zugriff auf die Datenbank.
2. Bessere Tabellenstruktur mit mehreren Tabellen und Normalformen für eine weiger fehleranfällige verwaltung.
3. Vorgeschrieben Typen und Pflichtfeldern auf Datenbankebene.
4. Nutzen eines ORMs um kein manuelles SQL zu sschreiben.
