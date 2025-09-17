(() => {
	const ready = (fn) =>
		document.readyState === "loading"
			? document.addEventListener("DOMContentLoaded", fn)
			: fn();

	ready(async () => {
		const container = document.querySelector(".team-1-3");
		if (!container) return;

		// Zorg dat container relative is voor absolute canvas
		container.style.position = container.style.position || "relative";

		// maak canvas
		const canvas = document.createElement("canvas");
		canvas.style.position = "fixed"; // overlay
		canvas.style.bottom = 0;
		canvas.style.right = 0;
		canvas.style.width = "80vw";
		canvas.style.height = "80vh";
		canvas.style.zIndex = "-1"; // achter alle content
		canvas.style.pointerEvents = "none"; // klikbare elementen blijven werken
		document.body.appendChild(canvas);

		const ctx = canvas.getContext("2d");
		function resize() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}
		resize();
		window.addEventListener("resize", resize);

		// weer API
		async function getWeather(lat = 50.8503, lon = 4.3517) {
			const res = await fetch(
				`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&timezone=auto`
			);
			return res.json();
		}

		function mapWeather(code) {
			if (code === 0) return "sun";
			if (code >= 1 && code <= 3) return "clouds";
			if (
				(code >= 45 && code <= 48) ||
				(code >= 51 && code <= 67) ||
				(code >= 80 && code <= 82)
			)
				return "rain";
			if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86))
				return "snow";
			if (code >= 95) return "rain";
			return "clouds";
		}

		function draw(weather, temp) {
			const w = canvas.width;
			const h = canvas.height;
			let gradient;

			if (weather === "sun")
				(gradient = ctx.createLinearGradient(0, 0, 0, h)),
					gradient.addColorStop(0, "#fff1a8"),
					gradient.addColorStop(1, "#a0d8ff");
			else if (weather === "clouds")
				(gradient = ctx.createLinearGradient(0, 0, 0, h)),
					gradient.addColorStop(0, "#d7d2cc"),
					gradient.addColorStop(1, "#88a0b4");
			else if (weather === "rain")
				(gradient = ctx.createLinearGradient(0, 0, 0, h)),
					gradient.addColorStop(0, "#6f7bd9"),
					gradient.addColorStop(1, "#8f94fb");
			else
				(gradient = ctx.createLinearGradient(0, 0, 0, h)),
					gradient.addColorStop(0, "#e6f0ff"),
					gradient.addColorStop(1, "#cfe8ff");

			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, w, h);

			// tekst midden onder
			ctx.fillStyle = "#000";
			ctx.font = "24px Arial";
			ctx.textAlign = "center";
			ctx.fillText(`${temp}°C over 1 uur`, w / 2, h - 40);
		}

		async function update() {
			let lat = 50.8503,
				lon = 4.3517;
			if (navigator.geolocation) {
				try {
					const pos = await new Promise((res) =>
						navigator.geolocation.getCurrentPosition((p) => res(p))
					);
					lat = pos.coords.latitude;
					lon = pos.coords.longitude;
				} catch {}
			}

			const data = await getWeather(lat, lon);
			const times = data.hourly.time.map((t) => new Date(t));
			const now = new Date();
			const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
			let idx = times.findIndex((t) => t >= nextHour);
			if (idx < 0) idx = 0;
			const temp = data.hourly.temperature_2m[idx];
			const weather = mapWeather(data.hourly.weathercode[idx]);

			draw(weather, temp);
		}

		await update();
		setInterval(update, 60 * 60 * 1000);
	});
})();
