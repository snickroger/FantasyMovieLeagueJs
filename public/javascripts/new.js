countdown(updateCountdown, seasonStart, countdown.WEEKS|countdown.DAYS|countdown.HOURS|countdown.MINUTES|countdown.SECONDS);

function updateCountdown(ts) {
    document.getElementById('deadline').innerHTML = ts.toHTML();
}