import React from 'react'
import Particles from 'react-tsparticles'

export default function LoginParticles() {
  return (
    <Particles
      params={{
        background: {
          color: {
            value: '#f6d2cf',
          },
          position: '50% 50%',
          repeat: 'no-repeat',
          size: 'cover',
        },
        fullScreen: {
          zIndex: 1,
        },
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: 'push',
            },
            onDiv: {
              selectors: '#repulse-div',
              mode: 'repulse',
            },
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.8,
              size: 40,
            },
            grab: {
              distance: 400,
            },
          },
        },
        particles: {
          color: {
            value: '#ffffff',
          },
          links: {
            color: {
              value: '#000',
            },
            distance: 150,
            opacity: 0.4,
          },
          move: {
            attract: {
              rotate: {
                x: 600,
                y: 1200,
              },
            },
            enable: true,
            outModes: {
              bottom: 'out',
              left: 'out',
              right: 'out',
              top: 'out',
            },
          },
          number: {
            density: {
              enable: true,
            },
            value: 80,
          },
          opacity: {
            random: {
              enable: true,
            },
            value: {
              min: 0.1,
              max: 1,
            },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.2,
            },
          },
          rotate: {
            random: {
              enable: true,
            },
            animation: {
              enable: true,
              speed: 5,
            },
            direction: 'random',
          },
          shape: {
            options: {
              character: {
                fill: false,
                font: 'Verdana',
                style: '',
                value: '*',
                weight: '400',
              },
              char: {
                fill: false,
                font: 'Verdana',
                style: '',
                value: '*',
                weight: '400',
              },
              polygon: {
                sides: 5,
              },
              star: {
                sides: 5,
              },
              image: [
                {
                  src: 'https://particles.js.org/images/fruits//apple.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//avocado.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//banana.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//berries.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//cherry.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//grapes.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//lemon.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//orange.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//peach.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//pear.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//pepper.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//plum.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//star.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//strawberry.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//watermelon.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//watermelon_slice.png',
                  width: 32,
                  height: 32,
                },
              ],
              images: [
                {
                  src: 'https://particles.js.org/images/fruits//apple.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//avocado.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//banana.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//berries.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//cherry.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//grapes.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//lemon.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//orange.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//peach.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//pear.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//pepper.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//plum.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//star.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//strawberry.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//watermelon.png',
                  width: 32,
                  height: 32,
                },
                {
                  src: 'https://particles.js.org/images/fruits//watermelon_slice.png',
                  width: 32,
                  height: 32,
                },
              ],
            },
            type: 'image',
          },
          size: {
            value: 16,
            animation: {
              speed: 40,
              minimumValue: 0.1,
            },
          },
          stroke: {
            color: {
              value: '#000000',
              animation: {
                h: {
                  count: 0,
                  enable: false,
                  offset: 0,
                  speed: 1,
                  sync: true,
                },
                s: {
                  count: 0,
                  enable: false,
                  offset: 0,
                  speed: 1,
                  sync: true,
                },
                l: {
                  count: 0,
                  enable: false,
                  offset: 0,
                  speed: 1,
                  sync: true,
                },
              },
            },
          },
        },
      }}
    />
  )
}
