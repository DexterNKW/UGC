document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("announcementForm").addEventListener("submit", generateMessage);
  document.getElementById("tipoSerataInput").addEventListener("change", toggleCustomSerataInput);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("focus", handleWindowFocus);
});

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

  const announcementForm = document.getElementById("announcementForm");
  announcementForm.style.display = "none";
  const generateButton = document.querySelector(".copy-button");
  generateButton.style.display = "none";

  const reloadButton = document.getElementById("reloadButton");
  reloadButton.style.display = "inline-block";

  const dataInput = document.getElementById("dataInput").value;
  const tipoSerataInput = document.getElementById("tipoSerataInput").value;
  const customSerataInput = document.getElementById("customSerataInput").value;
  const ingressoInput = document.getElementById("ingressoInput").value;
  const startInput = document.getElementById("startInput").value;
  const chiusuraInput = document.getElementById("chiusuraInput").value;

  const formatter = new WhatsAppFormatter();
  const message = formatter.generateFormattedMessage(dataInput, tipoSerataInput, customSerataInput, ingressoInput, startInput, chiusuraInput);

  const formattedMessage = formatText(message);

  const messageContentElement = document.getElementById("message-content");
  messageContentElement.innerHTML = formattedMessage;

  const timestampElement = document.getElementById("timestamp");
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const timestamp = hours + ":" + minutes;
  timestampElement.innerHTML = timestamp;

  document.getElementById("messageOutputContainer").classList.remove("hidden");

  // Update the copy button functionality
  const copyButton = document.getElementById("copyButton");
  copyButton.addEventListener("click", function () {
    copyToClipboard(message);
  });

  return false;
}

function copyToClipboard(text) {
  const tempInput = document.createElement("textarea");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}

function handleVisibilityChange() {
  if (document.visibilityState === "visible") {
    document.title = "Annunci | UGC";
  } else {
    document.title = "UnderGround Club";
  }
}

function handleWindowFocus() {
  document.title = "Annunci | UGC";
}

class WhatsAppFormatter {
  getFormattedDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: "long", day: "numeric", month: "long" };
    return date.toLocaleDateString("it-IT", options).replace(/^\w/, (c) => c.toUpperCase());
  }

  getNextSaturday() {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const daysUntilSaturday = currentDayOfWeek === 6 ? 0 : 6 - currentDayOfWeek;
    const nextSaturday = new Date(today.getTime() + daysUntilSaturday * 24 * 60 * 60 * 1000);
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

    const currentMonth = formattedDate.split(' ')[1].toLowerCase(); // Ottieni il mese dalla data formattata.

    let seasonText;
    if (["giugno", "luglio", "agosto"].includes(currentMonth)) {
      seasonText = "                ••• *S U M M E R* •••";
    } else {
      seasonText = "                 ••• *G O L D E N* •••";
    }

    let defaultSerata, defaultIngresso, defaultStart, defaultChiusura;

    if (serata === "disco") {
      defaultSerata = `Serata Disco con DJ Set e angolo Bar`;
      defaultIngresso = "20:30";
      defaultStart = "21:00";
      defaultChiusura = "01:00";
    } else if (serata === "chill") {
      defaultSerata = `Serata Chill con Musica e angolo Bar`;
      defaultIngresso = "20:00";
      defaultStart = "20:30";
      defaultChiusura = "22:00";
    } else if (serata === "custom") {
      defaultSerata = customSerata || `Serata Disco con DJ Set e angolo Bar`;
      defaultIngresso = "20:30";
      defaultStart = "21:00";
      defaultChiusura = "01:00";
    } else {
      defaultSerata = `Serata Disco con DJ Set e angolo Bar`;
      defaultIngresso = "20:30";
      defaultStart = "21:00";
      defaultChiusura = "01:00";
    }

    let message = ":: 🪩 *ᑌᑎᗪᗴᖇᘜᖇOᑌᑎᗪ ᑕᒪᑌᗷ* 🪩 ::\n";
        message += `${seasonText}\n\n`;
        message += `_${defaultSerata}_\n\n`;
        message += `   🗓️ *${formattedDate}*\n\n`;
        message += `   ➡️ Ingresso h. *${ingresso || defaultIngresso}*\n`;
        message += `   ➡️ Start h. *${start || defaultStart}*\n`;
        message += `   ➡️ Chiusura h. *${chiusura || defaultChiusura}*\n\n`;
        message += "*UNDERGROUND CLUB STAFF*©️";

    return message;
  }
}

function formatText(text) {
  var formattedText = twemoji.parse(text);
  formattedText = formattedText.replace(/\*(.*?)\*/g, '<span class="bold">$1</span>');
  formattedText = formattedText.replace(/_(.*?)_/g, '<span class="italic">$1</span>');
  formattedText = formattedText.replace(/\n/g, "<br>");

  formattedText = formattedText.replace(/ {7,}/g, function(match) {
    var reducedSpaces = "   ";
    var remainingSpaces = match.length - 7;
    if (remainingSpaces > 0) {
      reducedSpaces += " ".repeat(Math.ceil(remainingSpaces / 4));
    }
    return reducedSpaces;
  });

  formattedText = "<pre>" + formattedText + "</pre>";
  return formattedText;
}

document.getElementById("reloadButton").addEventListener("click", function() {
  location.reload();
});
