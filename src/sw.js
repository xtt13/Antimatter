var cacheName = 'EPT-v1';
var appShellFiles = [
    // './index.html',

    // './dist/bundle.js',
    // './dist/vendor.bundle.js',

    // './assets/favicons/android-icon-48x48.png',
    // './assets/favicons/android-icon-36x36.png',
    // './assets/favicons/android-icon-72x72.png',
    // './assets/favicons/android-icon-96x96.png',
    // './assets/favicons/android-icon-144x144.png',
    // './assets/favicons/android-icon-192x192.png',
    // './assets/favicons/apple-icon-57x57.png',
    // './assets/favicons/apple-icon-60x60.png',
    // './assets/favicons/apple-icon-72x72.png',
    // './assets/favicons/apple-icon-76x76.png',
    // './assets/favicons/apple-icon-114x114.png',
    // './assets/favicons/apple-icon-120x120.png',
    // './assets/favicons/apple-icon-144x144.png',
    // './assets/favicons/apple-icon-152x152.png',
    // './assets/favicons/apple-icon-180x180.png',
    // './assets/favicons/apple-icon-precomposed.png',
    // './assets/favicons/apple-icon.png',
    // './assets/favicons/browserconfig.xml',
    // './assets/favicons/favicon-16x16.png',
    // './assets/favicons/favicon-32x32.png',
    // './assets/favicons/favicon-96x96.png',
    // './assets/favicons/favicon.ico',
    // './assets/favicons/manifest.json',
    // './assets/favicons/ms-icon-70x70.png',
    // './assets/favicons/ms-icon-144x144.png',
    // './assets/favicons/ms-icon-150x150.png',
    // './assets/favicons/ms-icon-310x310.png',

    // './assets/fonts/font.png',
    // './assets/fonts/font.xml',
    // './assets/fonts/minecraftia-black.png',
    // './assets/fonts/minecraftia.xml',
    // // './assets/fonts/MunroNarrow.ttf',
    // // './assets/fonts/Pixeled.ttf',
    // './assets/fonts/prophecy.fnt',
    // './assets/fonts/prophecy.png',

    // './assets/input/dpad.json',
    // './assets/input/dpad.png',
    // './assets/input/generic-joystick.json',
    // './assets/input/generic-joystick.png',
    // './assets/input/mapButton.png',
    // './assets/input/muteMusicButton.png',
    // './assets/input/muteSoundButton.png',
    // './assets/input/optionsButton.png',
    // './assets/input/questButton.png',

    // './assets/maps/default.json',
    // './assets/maps/map1.json',
    // './assets/maps/map2.json',
    // './assets/maps/map3.json',
    // './assets/maps/map4.json',
    // './assets/maps/map5.json',
    // './assets/maps/map6.json',
    // './assets/maps/map7.json',
    // './assets/maps/map8.json',
    // './assets/maps/map9.json',
    // './assets/maps/map10.json',
    // './assets/maps/map11.json',

    // './assets/music/HopeMerged.mp3',
    // './assets/music/LostMerged.mp3',
    // './assets/music/MxAncius.mp3',
    // './assets/music/MxBeginn.mp3',
    // './assets/music/MxBossfight.mp3',
    // './assets/music/MxTempleHappy.mp3',

    // // './assets/sounds',
    // './assets/sounds/achivement.mp3',
    // './assets/sounds/AtmoWaterStill.mp3',
    // './assets/sounds/AtmoWindRain.mp3',
    // './assets/sounds/AxBotanic.mp3',
    // './assets/sounds/AxCrickets.mp3',
    // './assets/sounds/AxForest.mp3',
    // './assets/sounds/AxOpenPlain.mp3',
    // './assets/sounds/AxTemple.mp3',
    // './assets/sounds/AxThunderstrike.mp3',
    // './assets/sounds/AxWaterChilled.mp3',
    // './assets/sounds/AxWaterfall.mp3',
    // './assets/sounds/PxFootsteps.mp3',
    // './assets/sounds/sfxBossReverb.mp3',
    // './assets/sounds/sfxBridge.mp3',
    // './assets/sounds/sfxfalldown.mp3',
    // './assets/sounds/sfxheartbeat.mp3',
    // './assets/sounds/sfxletters.mp3',
    // './assets/sounds/sfxPickUp.mp3',
    // './assets/sounds/sfxstonedoor.mp3',
    // './assets/sounds/sfxSword.mp3',
    // './assets/sounds/sfxswordmulti.mp3',
    // './assets/sounds/startGame.mp3',
    // './assets/sounds/VxBotanic.mp3',
    // './assets/sounds/vxSeeds.mp3',
    // './assets/sounds/VxSmith.mp3',

    // './assets/tilesets/Clouds.png',
    // './assets/tilesets/godrays.png',
    // './assets/tilesets/tileset.png',

    // './assets/sprites/doors/bossDoor.png',
    // './assets/sprites/doors/templeDoor.png',
    // './assets/sprites/endboss/endBoss.png',
    // './assets/sprites/endboss/endBossClaw1.png',
    // './assets/sprites/endboss/endBossClaw2.png',
    // './assets/sprites/endboss/endBossHead.png',
    // './assets/sprites/endboss/endBossHeadShadow.png',
    // './assets/sprites/endboss/endBossNeck.png',
    // './assets/sprites/enemies/bird.png',
    // './assets/sprites/enemies/bulletRock.png',
    // './assets/sprites/enemies/enemy_alt.png',
    // './assets/sprites/enemies/enemy.png',
    // './assets/sprites/enemies/enemyPartsSpritesheet.png',
    // './assets/sprites/enemies/rock.png',
    // './assets/sprites/enemies/sprout.png',
    // './assets/sprites/gui/cursor.png',
    // './assets/sprites/gui/dashBar.png',
    // './assets/sprites/gui/gamePadHelper.png',
    // './assets/sprites/gui/heart.png',
    // './assets/sprites/gui/logo.png',
    // './assets/sprites/gui/newGameMap.png',
    // './assets/sprites/gui/talk.png',
    // './assets/sprites/items/potion.png',
    // './assets/sprites/items/testitem.png',
    // './assets/sprites/lockgame/LockGameBall.png',
    // './assets/sprites/lockgame/LockGameBar.png',
    // './assets/sprites/lockgame/LockGameRing.png',
    // './assets/sprites/lucy/lucy.png',
    // './assets/sprites/lucy/lucyShadow.png',
    // './assets/sprites/particles/blackParticle.png',
    // './assets/sprites/particles/blood.png',
    // './assets/sprites/particles/bloodEnemy.png',
    // './assets/sprites/particles/bloodHeart.png',
    // './assets/sprites/particles/bulletBeam.png',
    // './assets/sprites/particles/bulletParticle.png',
    // './assets/sprites/particles/cyanParticle.png',
    // './assets/sprites/particles/fireSpritesheet.png',
    // './assets/sprites/particles/fly.png',
    // './assets/sprites/particles/glimmerParticle.png',
    // './assets/sprites/particles/leave.png',
    // './assets/sprites/particles/particle.png',
    // './assets/sprites/particles/particleStart.png',
    // './assets/sprites/particles/rain.png',
    // './assets/sprites/particles/snow.png',
    // './assets/sprites/particles/sparklingSpritesheet.png',
    // './assets/sprites/particles/treeleaves.png',
    // './assets/sprites/particles/waterdrop.png',
    // './assets/sprites/player/bulletPlayer.png',
    // './assets/sprites/player/invisibleAttack.png',
    // './assets/sprites/player/player.png',
    // './assets/sprites/player/playerArm.png',
    // './assets/sprites/villager/botanist.png',
    // './assets/sprites/villager/girl1.png',
    // './assets/sprites/villager/girl2.png',
    // './assets/sprites/villager/girl3.png',
    // './assets/sprites/villager/inhabitant1.png',
    // './assets/sprites/villager/librarian.png',
    // './assets/sprites/villager/priest.png',
    // './assets/sprites/villager/smith.png',
    // './assets/sprites/villager/veteran.png',
    // './assets/sprites/villager/woman1.png',
    // './assets/sprites/villager/woman2.png',
    // './assets/sprites/branch.png',
    // './assets/sprites/chest.png',
    // './assets/sprites/cloud.png',
    // './assets/sprites/island.png'

];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(appShellFiles);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      return r || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});


// self.addEventListener('install', function(event) {
//     event.waitUntil(
//       caches.open(cache_name)
//       .then(function(cache) {
//         return cache.addAll(cached_urls);
//       })
//     );
//   });
  
//   self.addEventListener('activate', function(event) {
//     event.waitUntil(
//       caches.keys().then(function(cacheNames) {
//         return Promise.all(
//           cacheNames.map(function(cacheName) {
//             if (cacheName.startsWith('pages-cache-') && staticCacheName !== cacheName) {
//               return caches.delete(cacheName);
//             }
//           })
//         );
//       })
//     );
//   });
  
//   self.addEventListener('fetch', function(event) {
//       console.log('Fetch event for ', event.request.url);
//       event.respondWith(
//         caches.match(event.request).then(function(response) {
//           if (response) {
//             console.log('Found ', event.request.url, ' in cache');
//             return response;
//           }
//           console.log('Network request for ', event.request.url);
//           return fetch(event.request).then(function(response) {
//             if (response.status === 404) {
//               return caches.match('fourohfour.html');
//             }
//             return caches.open(cached_urls).then(function(cache) {
//              cache.put(event.request.url, response.clone());
//               return response;
//             });
//           });
//         }).catch(function(error) {
//           console.log('Error, ', error);
//           return caches.match('offline.html');
//         })
//       );
//     });