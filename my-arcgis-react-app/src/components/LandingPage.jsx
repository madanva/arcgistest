import React from 'react';
import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import config from "@arcgis/core/config";
import "@arcgis/core/assets/esri/themes/dark/main.css";
import './LandingPage.css';

function LandingPage({ onGetStarted }) {
  const mapRef = React.useRef(null);
  const [view, setView] = React.useState(null);
  const rotationRef = React.useRef(null);

  React.useEffect(() => {
    if (!mapRef.current) return;

    // Configure ArcGIS API
    config.assetsPath = "./assets";

    try {
      const map = new Map({
        basemap: "satellite",
        ground: "world-elevation"
      });

      const view = new SceneView({
        container: mapRef.current,
        map: map,
        environment: {
          background: {
            type: "color",
            color: [0, 0, 0, 1]
          },
          starsEnabled: true,
          atmosphereEnabled: true,
          atmosphere: {
            quality: "high"
          },
          stars: {
            density: 1,
            atmosphereEffect: 0.4
          },
          lighting: {
            directShadowsEnabled: true,
            date: new Date(),
            cameraTrackingEnabled: false
          }
        },
        camera: {
          position: {
            x: -10000000,
            y: 5000000,
            z: 20000000
          },
          heading: 0,
          tilt: 0
        },
        center: [-100, 40],
        zoom: 1,
        constraints: {
          altitude: {
            min: 1000,
            max: 25000000
          }
        },
        viewingMode: "global",
        qualityProfile: "high",
        navigation: {
          mouseWheelZoomEnabled: false,
          browserTouchPanEnabled: false,
          dragEnabled: false
        }
      });

      // Create a graphics layer for markers
      const markerLayer = new GraphicsLayer({
        elevationInfo: {
          mode: "relative-to-ground",
          offset: 50000
        }
      });
      map.add(markerLayer);

      // Sample fire locations around the globe
      const fireLocations = [
        // North America
        { longitude: -100, latitude: 40, intensity: 1.2 },
        { longitude: -120, latitude: 35, intensity: 1 },
        { longitude: -80, latitude: 45, intensity: 1.5 },
        // South America
        { longitude: -60, latitude: -15, intensity: 1.3 },
        { longitude: -70, latitude: -35, intensity: 1.1 },
        // Europe
        { longitude: 10, latitude: 50, intensity: 1 },
        { longitude: 20, latitude: 45, intensity: 1.2 },
        { longitude: 30, latitude: 55, intensity: 1.1 },
        // Africa
        { longitude: 20, latitude: 0, intensity: 1.4 },
        { longitude: 30, latitude: -20, intensity: 1.2 },
        { longitude: 15, latitude: -25, intensity: 1.3 },
        // Asia
        { longitude: 100, latitude: 35, intensity: 1.1 },
        { longitude: 120, latitude: 30, intensity: 1.3 },
        { longitude: 140, latitude: 35, intensity: 1.2 },
        { longitude: 80, latitude: 20, intensity: 1.4 },
        // Australia
        { longitude: 135, latitude: -25, intensity: 1.5 },
        { longitude: 145, latitude: -30, intensity: 1.2 },
        { longitude: 115, latitude: -20, intensity: 1.3 },
        // Additional scattered locations
        { longitude: -160, latitude: 20, intensity: 1 },
        { longitude: 60, latitude: 60, intensity: 1.1 },
        { longitude: -40, latitude: 70, intensity: 1 },
        { longitude: 170, latitude: -40, intensity: 1.2 },
        { longitude: -150, latitude: -40, intensity: 1.1 },
        { longitude: 50, latitude: -10, intensity: 1.3 }
      ];

      // Wait for view to be ready before adding graphics
      view.when(() => {
        // Create markers
        fireLocations.forEach((loc, index) => {
          const point = new Point({
            longitude: loc.longitude,
            latitude: loc.latitude
          });

          // Create glowing orb symbol using SVG
          const markerSymbol = {
            type: "picture-marker",
            url: "data:image/svg+xml," + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="orbGrad${index}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style="stop-color:#FFA500;stop-opacity:1"/>
                    <stop offset="100%" style="stop-color:#FFA500;stop-opacity:0"/>
                  </radialGradient>
                </defs>
                <!-- Main dot -->
                <circle cx="20" cy="20" r="4" fill="#FF6B00">
                  <animate attributeName="opacity"
                          values="1;0.4;1"
                          dur="2s"
                          repeatCount="indefinite"
                          calcMode="spline"
                          keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
                </circle>
                <!-- Outer ring -->
                <circle cx="20" cy="20" r="6" fill="none" stroke="#FF4500" stroke-width="1">
                  <animate attributeName="r"
                          values="6;10;6"
                          dur="3s"
                          repeatCount="indefinite"
                          calcMode="spline"
                          keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
                  <animate attributeName="opacity"
                          values="0.8;0;0.8"
                          dur="3s"
                          repeatCount="indefinite"
                          calcMode="spline"
                          keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
                </circle>
                <!-- Pulse ring -->
                <circle cx="20" cy="20" r="4" fill="none" stroke="#FF8C00" stroke-width="1">
                  <animate attributeName="r"
                          values="4;8;4"
                          dur="2s"
                          repeatCount="indefinite"
                          calcMode="spline"
                          keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
                  <animate attributeName="opacity"
                          values="1;0;1"
                          dur="2s"
                          repeatCount="indefinite"
                          calcMode="spline"
                          keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
                </circle>
              </svg>
            `),
            width: 25 * loc.intensity,  // Reduced size
            height: 25 * loc.intensity   // Reduced size
          };

          const markerGraphic = new Graphic({
            geometry: point,
            symbol: markerSymbol
          });

          markerLayer.add(markerGraphic);
        });

        // Add slow rotation around Earth's axis
        const rotate = () => {
          const camera = view.camera.clone();
          
          // Calculate new camera position
          const angle = (Date.now() * 0.002) % 360; // Much slower rotation
          const radius = Math.sqrt(camera.position.x * camera.position.x + camera.position.y * camera.position.y);
          
          camera.position.x = radius * Math.cos(angle * Math.PI / 180);
          camera.position.y = radius * Math.sin(angle * Math.PI / 180);
          
          view.goTo(camera, {
            animate: false,
            duration: 0
          }).catch(() => {});
          
          rotationRef.current = requestAnimationFrame(rotate);
        };
        
        rotate();
      }).catch(error => {
        console.error("Error creating view:", error);
      });

      setView(view);
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      if (rotationRef.current) {
        cancelAnimationFrame(rotationRef.current);
      }
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return (
    <div className="landing-page">
      <div className="landing-content">
        <div className="landing-text">
          <h1>FireWatch</h1>
          <p>Real-time wildfire monitoring and tracking system</p>
          <button className="cta-primary" onClick={onGetStarted}>
            Get Started
          </button>
        </div>
      </div>
      <div ref={mapRef} className="globe-container" />
    </div>
  );
}

export default LandingPage;
