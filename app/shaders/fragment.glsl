// app/shaders/fragment.glsl
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uTime;
uniform float uRadius;
uniform float uStrength;
uniform float uFrequency;

varying vec2 vUv;

void main() {
    // Calculate the distance from the current pixel to the mouse position
    float dist = distance(vUv, uMouse);

    // Create a circular ripple that animates over time
    float ripple = sin(dist * uFrequency - uTime);

    // Apply the ripple effect only within a certain radius, and fade it out
    float falloff = 1.0 - smoothstep(uRadius * 0.9, uRadius, dist);
    ripple *= falloff;

    // The amount of distortion based on the ripple
    vec2 distortion = vec2(ripple * uStrength);

    // Apply the distortion to the texture coordinates
    vec4 textureColor = texture2D(uTexture, vUv + distortion);

    gl_FragColor = textureColor;
}