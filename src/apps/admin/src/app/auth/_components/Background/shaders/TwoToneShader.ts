import { Color, Vector3 } from "three";

/**
 * Two-tone shader uniforms data type
 */
export type TwoToneShaderUniforms = {
  colorMap: {
    value: [Color, Color];
  };
  brightnessThreshold: {
    value: number;
  };
  lightPosition: {
    value: Vector3 | [number, number, number];
  };
};

/**
 * Two-tone GLSL shader
 */
export const TwoToneShader = {
  vertexShader: /* glsl */ `
    precision highp float;
    precision highp int;

    varying vec3 vNormal;
    varying vec3 vPosition;
  
    void main() {
      vNormal = normal;
      vPosition = position;

      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      
    }
    `,
  fragmentShader: /* glsl */ `
    precision highp float;
    precision highp int;

    // Default THREE.js uniforms available to both fragment and vertex shader
    uniform mat4 modelMatrix;

    uniform vec3 colorMap[2];
    uniform float brightnessThreshold;
    uniform vec3 lightPosition;

    // Variables passed from vertex to fragment shader
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 worldPosition = ( modelMatrix * vec4( vPosition, 1.0 )).xyz;
      vec3 worldNormal = normalize( vec3( modelMatrix * vec4( vNormal, 0.0 ) ) );
      vec3 lightVector = normalize( lightPosition - worldPosition );
      float brightness = dot( worldNormal, lightVector );

      vec4 final;

      if (brightness > brightnessThreshold)
        final = vec4(colorMap[0], 1);
      else
        final = vec4(colorMap[1], 1);

      gl_FragColor = vec4(final);
      
      #include <colorspace_fragment>
    }
    `,
};
