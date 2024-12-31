export const TwoToneShader = {
  vertexShader: /* glsl */ `
    #ifdef SKINNING_DEFINED
    precision highp float;
    precision highp int;
    #include <common>
    #include <skinning_pars_vertex>
    #endif

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vTexCoord;
  
    void main() {
      #ifdef SKINNING_DEFINED
      #include <skinbase_vertex>
      #include <begin_vertex>
      #include <beginnormal_vertex>
      #include <defaultnormal_vertex>
      #include <skinning_vertex>
      #include <project_vertex>
      #endif
      
      vNormal = normal;
      vPosition = position;
      vTexCoord = uv;

      gl_Position = projectionMatrix * mvPosition;
      
    }
    `,
  fragmentShader: /* glsl */ `
    precision highp float;
    precision highp int;

    // Default THREE.js uniforms available to both fragment and vertex shader
    uniform mat4 modelMatrix;

    #ifdef TEXTURE_DEFINED
    uniform sampler2D texture1;
    #endif
    uniform vec3 colorMap[2];
    uniform float brightnessThreshold;
    uniform vec3 lightPosition;

    // Variables passed from vertex to fragment shader
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vTexCoord;

    void main() {
      vec3 worldPosition = ( modelMatrix * vec4( vPosition, 1.0 )).xyz;
      vec3 worldNormal = normalize( vec3( modelMatrix * vec4( vNormal, 0.0 ) ) );
      vec3 lightVector = normalize( lightPosition - worldPosition );
      float brightness = dot( worldNormal, lightVector );
      
      #ifdef TEXTURE_DEFINED
      vec4 texColor = texture2D(texture1, vTexCoord);
      float texBrightness = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
      #else
      float texBrightness = 1.0;
      #endif
      
      float combinedBrightness = brightness * texBrightness;

      vec4 final;

      if (combinedBrightness > brightnessThreshold)
        final = vec4(colorMap[0], 1);
      else
        final = vec4(colorMap[1], 1);

      gl_FragColor = vec4(final);
      
      #include <colorspace_fragment>
    }
    `,
};
