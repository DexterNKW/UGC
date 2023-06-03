document.getElementById("announcementForm").addEventListener("submit", generateMessage);
document.getElementById("copyButton").addEventListener("click", copyToClipboard);
document.getElementById("tipoSerataInput").addEventListener("change", toggleCustomSerataInput);

function toggleCustomSerataInput() {
    const customSerataContainer = document.getElementById("customSerataContainer");
    const tipoSerataInput = document.getElementById("tipoSerataInput");

    if (tipoSerataInput.value === "custom") {
        customSerataContainer.classList.remove("hidden");
    } else {
        customSerataContainer.classList.add("hidden");
    }
}

function generateMessage(event) {
    event.preventDefault();

    const dataInput = document.getElementById("dataInput").value;
    const tipoSerataInput = document.getElementById("tipoSerataInput").value;
    const customSerataInput = document.getElementById("customSerataInput").value;
    const ingressoInput = document.getElementById("ingressoInput").value;
    const startInput = document.getElementById("startInput").value;
    const chiusuraInput = document.getElementById("chiusuraInput").value;

    const formatter = new WhatsAppFormatter();
    const message = formatter.generateFormattedMessage(dataInput, tipoSerataInput, customSerataInput, ingressoInput, startInput, chiusuraInput);

    document.getElementById("messageOutput").value = message;
    document.getElementById("messageOutputContainer").classList.remove("hidden");
}

function copyToClipboard() {
    const messageOutput = document.getElementById("messageOutput");
    messageOutput.select();
    document.execCommand("copy");
}

class WhatsAppFormatter {
    getFormattedDate(dateString) {
        const date = new Date(dateString);
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        return date.toLocaleDateString('it-IT', options).replace(/^\w/, c => c.toUpperCase());
    }

    getNextSaturday() {
        const today = new Date();
        const currentDayOfWeek = today.getDay();
        const daysUntilSaturday = currentDayOfWeek === 6 ? 0 : (6 - currentDayOfWeek);
        const nextSaturday = new Date(today.getTime() + (daysUntilSaturday * 24 * 60 * 60 * 1000));
        return nextSaturday;
    }

    generateFormattedMessage(data, serata, customSerata, ingresso, start, chiusura) {
        let formattedDate;

        if (data) {
            formattedDate = this.getFormattedDate(data);
        } else {
            const nextSaturday = this.getNextSaturday();
            formattedDate = this.getFormattedDate(nextSaturday);
        }

        let defaultSerata, defaultIngresso, defaultStart, defaultChiusura;

        if (serata === "disco") {
            defaultSerata = "_Serata Disco con DJ Set e angolo Bar_";
            defaultIngresso = "*20:30*";
            defaultStart = "*21:00*";
            defaultChiusura = "*01:00*";
        } else if (serata === "chill") {
            defaultSerata = "_Serata Chill con Musica e angolo Bar_";
            defaultIngresso = "*20:00*";
            defaultStart = "*20:30*";
            defaultChiusura = "*22:00*";
        } else {
            defaultSerata = "_Serata Disco con DJ Set e angolo Bar_";
            defaultIngresso = "*20:30*";
            defaultStart = "*21:00*";
            defaultChiusura = "*01:00*";
        }

        let message = ":: 🪩 *ᑌᑎᗪᗴᖇᘜᖇOᑌᑎᗪ ᑕᒪᑌᗷ* 🪩 ::\n";
        message += "                ••• *S U M M E R* •••\n\n";
        message += `${customSerata ? customSerata : defaultSerata}\n\n`;
        message += `   🗓️ *${formattedDate}*\n\n`;
        message += `   ➡️ Ingresso h. ${ingresso || defaultIngresso}\n`;
        message += `   ➡️ Start h. ${start || defaultStart}\n`;
        message += `   ➡️ Chiusura h. ${chiusura || defaultChiusura}\n\n`;
        message += "*UNDERGROUND CLUB STAFF*©️";

        return message;
    }
}
