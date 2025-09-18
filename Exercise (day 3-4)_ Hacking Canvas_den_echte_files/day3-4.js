document.addEventListener("DOMContentLoaded", function () {
	const container = document.querySelector(".team-1-3");
	console.log({ container });

	// ---------------------------
	// Functie om weer op te halen
	// ---------------------------
	// Je moet altijd latitude en longitude doorgeven.
	// Voorbeeld: getWeather(50.85, 4.35)
	async function getWeather(lat, lon) {
		// Bouw de API url
		let url =
			"https://api.open-meteo.com/v1/forecast" +
			"?latitude=" +
			lat +
			"&longitude=" +
			lon +
			"&hourly=temperature_2m,weathercode&timezone=auto";

		// Vraag de data op
		let res = await fetch(url);

		// Zet het antwoord om naar JSON
		return res.json();
	}

	function mapWeather(code) {
		if (code === 0) {
			return "sun";
		} else if (code >= 1 && code <= 3) {
			return "clouds";
		} else if (
			(code >= 45 && code <= 48) ||
			(code >= 51 && code <= 67) ||
			(code >= 80 && code <= 82)
		) {
			return "rain";
		} else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
			return "snow";
		} else if (code >= 95) {
			return "rain";
		} else {
			return "sun";
		}
	}

	function setBackground(weather) {
		if (weather === "sun") {
			container.style.backgroundImage = "linear-gradient(#fff1a8, #a0d8ff)";
		} else if (weather === "clouds") {
			container.style.backgroundImage = "linear-gradient(#d7d2cc, #88a0b4)";
		} else if (weather === "rain") {
			container.style.backgroundImage = "linear-gradient(#6f7bd9, #8f94fb)";
		} else if (weather === "snow") {
			container.style.backgroundImage = "linear-gradient(#e6f0ff, #cfe8ff)";
		} else {
			container.style.backgroundImage = "linear-gradient(#d7d2cc, #88a0b4)";
		}
		console.log(container.style);


		// Zorg dat de achtergrond de hele pagina netjes vult
		container.style.backgroundRepeat = "no-repeat";
		container.style.backgroundAttachment = "fixed";
		container.style.backgroundSize = "cover";
	}

	// ---------------------------
	// Hoofdfunctie die alles samen doet
	// ---------------------------
	async function updateWeather() {


		let lat = 50.8503;
		let lon = 4.3517;

		// Probeer echte locatie te vragen aan gebruiker
		if (navigator.geolocation) {
			try {
				let pos = await new Promise((ok, err) => {
					navigator.geolocation.getCurrentPosition(ok, err);
				});
				lat = pos.coords.latitude;
				lon = pos.coords.longitude;
			} catch (e) {
				// Geen toestemming → dan blijft Brussel
			}
		}

		// Haal weer-data op
		let data = await getWeather(lat, lon);

		// Zet tijden van tekst naar Date-objecten
		let times = data.hourly.time.map((t) => new Date(t));

		// Pak het huidige moment
		let now = new Date();

		// Kijk naar 1 uur later
		let nextHour = new Date(now.getTime() + 60 * 60 * 1000);

		// Zoek in de lijst naar de eerstvolgende tijd
		let idx = times.findIndex((t) => t >= nextHour);

		// Als niets gevonden is → neem de eerste
		if (idx < 0) {
			idx = 0;
		}

		// Pak temperatuur en weer-code voor dat uur
		let temp = data.hourly.temperature_2m[idx];
		let weatherCode = data.hourly.weathercode[idx];

		// Zet code om naar "sun", "clouds", "rain", "snow"
		let weather = mapWeather(weatherCode);

		// Zet achtergrond
		setBackground(weather);

		// Zoek of er al een tekstvak is
		let info = document.getElementById("weather-info");

		// Zo niet → maak het aan
		if (!info) {
			info = document.createElement("div");
			info.id = "weather-info";

			// Stijl voor de tekst
			info.style.position = "fixed";
			info.style.bottom = "20px";
			info.style.width = "100%";
			info.style.textAlign = "center";
			info.style.fontSize = "24px";

			con.appendChild(info);
		}

		// Zet de tekst met temperatuur
		info.innerText = temp + "°C over 1 uur";
	}

	// ---------------------------
	// Start: roep de functie meteen aan
	// ---------------------------
	updateWeather();




	// En herhaal elke 60 minuten (3600000 ms)
	setInterval(updateWeather, 60 * 60 * 1000);
});
