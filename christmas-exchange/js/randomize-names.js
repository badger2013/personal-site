function getFamilies(splitLines) {
    let families = {};

    splitLines.forEach((fullName) => {
        let splitFullName = fullName.split("-");

        splitFullName[0] = splitFullName[0] ? splitFullName[0].trim() : undefined;
        splitFullName[1] = splitFullName[1] ? splitFullName[1].trim() : undefined;

        if (!splitFullName[1]) {
            console.warn(`missing surname for ${fullName}`);
            return;
        }

        console.log(`full name: ${splitFullName[0]} ${splitFullName[1]}`);

        if (!families[splitFullName[1]]) {
            families[splitFullName[1]] = [];
        }

        families[splitFullName[1]].push(splitFullName[0]);
    });

    console.log("families:");
    console.log(families);

    return families;
}

function deepCopy(families) {
    let familiesCopy = {};

    for (let family in families) {
        if (families[family] instanceof Array) {
            familiesCopy[family] = [];

            families[family].forEach((familyMember) => {
                familiesCopy[family].push(familyMember);
            });
        }
        // TODO? Add other possibilities
    }

    console.log("familiesCopy:");
    console.log(familiesCopy);

    return familiesCopy;
}

function getOutputHtml(output) {
    let html = [];

    output.forEach((line) => {
        console.log(line);
        let formattedLine = line.replace(/undefined/g, "<span style='color:red'>undefined</span>") + "<br />";

        html.push(formattedLine);
    });

    return html.join("");
}

function generateExchangeList(names) {
    if (!names) {
        console.warn("[generateExchangeList] No names");
        return;
    }

    console.log("lines: " + names);

    let splitLines = names.split(/\r?\n/g);

    console.log("number of lines: " + splitLines.length);

    let families = getFamilies(splitLines);
    let notAllMatched = true;
    let numTries = 0;

    while (notAllMatched) {
        let familiesCopy = deepCopy(families); // We use this copy to remove people from once they have received a gift
        let output = [];
        numTries++;

        console.log("************ Try number: " + numTries);

        for (let family in families) {
            console.log(`family: ${family}`);
            let possibleReceivingFamilies = [];

            for (let tempFamily in familiesCopy) {
                console.log(tempFamily);
                if (tempFamily != family && familiesCopy[tempFamily] && familiesCopy[tempFamily].length > 0) {
                    possibleReceivingFamilies.push(tempFamily);
                }
            }

            console.log(possibleReceivingFamilies);

            families[family].forEach((familyMember) => {
                let targetReceivingFamilyIndex = Math.floor(Math.random() * possibleReceivingFamilies.length);
                let targetReceivingFamily = possibleReceivingFamilies[targetReceivingFamilyIndex];

                console.log(`targetReceivingFamily: ${targetReceivingFamily}`);

                let targetRecipientIndex = Math.floor(Math.random() * familiesCopy[targetReceivingFamily].length);
                let targetRecipient = familiesCopy[targetReceivingFamily][targetRecipientIndex];

                console.log(`targetRecipient: ${targetRecipient}`);
                output.push(`${familyMember} - ${targetRecipient}`);
                familiesCopy[targetReceivingFamily].splice(targetRecipientIndex, 1);
            });
        }

        let allMatched = true;

        for (let family in familiesCopy) {
            if (familiesCopy[family].length > 0) {
                allMatched = false;
            }
        }

        notAllMatched = !allMatched;

        if (!notAllMatched) {
            console.log(output);
            document.getElementById("name-output").innerHTML = getOutputHtml(output);
        }
    }
}
