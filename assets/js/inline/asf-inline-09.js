    // Manas Próximas: initialize with cached location if available
    document.addEventListener('DOMContentLoaded', function() {
        const cached = localStorage.getItem('asf_user_location');
        if (cached) {
            try {
                const loc = JSON.parse(cached);
                const now = Date.now();
                if (now - loc.timestamp < 5 * 60 * 1000) { // 5 minutes
                    window.userLocation = { lat: loc.lat, lng: loc.lng };
                    // Optionally update UI to show location active
                    const statusDiv = document.getElementById('location-status');
                    if (statusDiv) {
                        statusDiv.innerHTML = `
                            <div style="background: #E8F5E9; padding: 15px; border-radius: 12px; text-align: center;">
                                <p style="color: #27AE60; font-weight: bold;">✅ Localização ativada!</p>
                                <p style="font-size: 12px; color: #666; margin-top: 5px;">${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</p>
                                <button onclick="requestLocation()" class="btn btn-secondary" style="margin-top: 10px;">Atualizar localização</button>
                            </div>
                        `;
                    }
                    // Find nearby manas
                    findNearbyManas();
                }
            } catch (e) {
                console.warn('Failed to parse cached location', e);
            }
        }
    });
