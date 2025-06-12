
window.addEventListener('load', () => {
    
    // --- 1. WEATHER LOGIC ---
    const apiKey = '5a516f35418197a20b3caa43617c8bfc'; 

    const updateUI = (data) => {
        const cityElement = document.querySelector('.city');
        const dateElement = document.querySelector('.date');
        const tempElement = document.querySelector('.temperature');
        const descElement = document.querySelector('.description');
        const humidityElement = document.querySelector('.humidity');
        const windElement = document.querySelector('.wind-speed');
        const iconElement = document.querySelector('.weather-icon');

        // Update text content
        cityElement.textContent = data.name;
        dateElement.textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        tempElement.textContent = `${Math.round(data.main.temp)}°C`;
        descElement.textContent = data.weather[0].description;
        humidityElement.textContent = `${data.main.humidity}%`;
        windElement.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h

        // Update weather icon
        const iconCode = data.weather[0].icon;
        iconElement.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    };

    const fetchWeatherByCoords = async (lat, lon) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Weather data not found.');
            }
            const data = await response.json();
            updateUI(data);
        } catch (error) {
            console.error('Error fetching weather:', error);
            document.querySelector('.city').textContent = 'Location not found';
        }
    };
    
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByCoords(latitude, longitude);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    document.querySelector('.city').textContent = 'Allow location access';
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };
    
    // Initial call to get location and weather
    getLocation();


    // --- 2. CURSOR TRAIL EFFECT ---
    document.addEventListener('mousemove', (e) => {
        const trail = document.createElement('div');
        trail.className = 'trail';
        
        // Position the trail element at the cursor's coordinates
        trail.style.left = `${e.pageX - 3}px`; // -3 to center the element
        trail.style.top = `${e.pageY - 3}px`;
        
        document.body.appendChild(trail);

        // Remove the element after the animation completes to prevent clutter
        setTimeout(() => {
            document.body.removeChild(trail);
        }, 700); // Must match the animation duration in CSS
    });
});