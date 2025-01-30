let adDisplayContainer;
let adsLoader;
let adsManager;

document.getElementById("startGameBtn").addEventListener("click", () => {
    document.getElementById("startGameBtn").style.display = "none"; // Hide start button
    document.getElementById("adContainer").style.display = "block"; // Show ad container
    startAds();
});

function initializeIMA() {
    adDisplayContainer = new google.ima.AdDisplayContainer(document.getElementById('adContainer'));

    // Initialize container before requesting ads
    adDisplayContainer.initialize();

    adsLoader = new google.ima.AdsLoader(adDisplayContainer);

    adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false
    );

    adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false
    );

    var adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
        'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
        'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
        'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';

    adsRequest.linearAdSlotWidth = 640;
    adsRequest.linearAdSlotHeight = 480;
    adsRequest.nonLinearAdSlotWidth = 640;
    adsRequest.nonLinearAdSlotHeight = 150;

    adsLoader.requestAds(adsRequest);
}

function onAdsManagerLoaded(event) {
    adsManager = event.getAdsManager(document.getElementById('gameCanvas'));

    adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
    adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, resumeGameAfterAd);
    adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, pauseGameForAd);

    try {
        adsManager.init(640, 480, google.ima.ViewMode.NORMAL);
        adsManager.setVolume(0); // Mute ad for autoplay compliance
        adsManager.start();
    } catch (error) {
        console.error("Ad failed to start: ", error);
        startGame(); // Skip ad and start game
    }
}

function onAdError(event) {
    console.error("Ad Error: ", event.getError());
    if (adsManager) {
        adsManager.destroy();
    }
    startGame(); // Skip ad if there's an error
}

function resumeGameAfterAd() {
    console.log("Ad finished, starting countdown...");
    document.getElementById("adContainer").style.display = "none"; // Hide ad container
    resumeGameAfterAd(); // Calls function in game.js to start countdown
}

function pauseGameForAd() {
    console.log("Ad is playing, pausing game...");
}

function startAds() {
    initializeIMA();
}
