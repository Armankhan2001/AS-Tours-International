document.addEventListener('DOMContentLoaded', () => {
    let deferredPrompt;
    // Get the button *after* the DOM is fully loaded
    const installButton = document.getElementById('installButton');

    // DEBUG: Log whether the button was successfully found
    if (installButton) {
        console.log('Install Button element successfully found.');
    } else {
        console.error('ERROR: Install Button element with ID "installButton" was NOT found in the DOM.');
        return; // Stop execution if the button is missing
    }


    // 1. Check if PWA is already installed
    // This uses CSS media query for standalone mode and referrer for Android WebAPK
    if (window.matchMedia('(display-mode: standalone)').matches || document.referrer.includes('android-app://')) {
        // App is already installed (or running in standalone mode)
        if (installButton) {
            installButton.style.display = 'none';
            console.log('PWA is installed. Hiding install button.');
        }
    } else {
        // 2. Listen for the browser's install prompt event
        // This event only fires if the browser detects the PWA criteria are met.
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing automatically
            e.preventDefault();
            
            // Stash the event so it can be triggered later.
            deferredPrompt = e;
            
            // Show the custom install button if it exists
            if (installButton) {
                // IMPORTANT: The browser controls when the prompt is available. 
                // We only show the button *after* receiving this event.
                installButton.style.display = 'block'; // Using 'block' is safer than 'flex' for a simple button
                console.log('BeforeInstallPrompt fired. Showing custom Install Button.');
                
                // Add click listener to trigger the saved prompt
                installButton.addEventListener('click', () => {
                    // Hide the button once the user clicks it and installation starts
                    installButton.style.display = 'none';
                    
                    // Show the browser prompt
                    deferredPrompt.prompt();
                    
                    // Wait for the user to respond to the prompt
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('User accepted the A2HS prompt');
                        } else {
                            console.log('User dismissed the A2HS prompt');
                            // If dismissed, you might show the button again or wait for the next page load
                            // For now, we leave it hidden.
                        }
                        deferredPrompt = null;
                    });
                }, { once: true }); // Use { once: true } to prevent duplicate listeners
            }
        });

        // 3. Listen for the app being successfully installed (after the prompt)
        window.addEventListener('appinstalled', () => {
            // Installation complete, immediately hide the button
            if (installButton) {
                installButton.style.display = 'none';
                console.log('PWA successfully installed by user.');
            }
        });
    }
});