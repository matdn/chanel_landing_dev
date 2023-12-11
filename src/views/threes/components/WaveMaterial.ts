import {
    AdditiveBlending,
    RepeatWrapping,
    ShaderMaterial,
    ShaderMaterialParameters,
    TextureLoader,
    Vector2,
} from "three";

export default class WaveMaterial extends ShaderMaterial {
    public updateMousePosition(mouseX: number, mouseY: number): void {
        if (this.uniforms.mousePosition) {
            this.uniforms.mousePosition.value = new Vector2(mouseX, mouseY);
        }
    }

    constructor() {
        const textureLoader = new TextureLoader();
        const waveTexture = textureLoader.load("./medias/img/waveGrey.png");
        const spriteTexture = textureLoader.load("./medias/img/letter.png");
        spriteTexture.flipY = false;
        waveTexture.wrapS = RepeatWrapping;
        waveTexture.wrapT = RepeatWrapping;

        const params: ShaderMaterialParameters = {
            transparent: true,
            depthWrite: false,
            blending: AdditiveBlending,
            precision: "highp",
            uniforms: {
                time: { value: 0 },
                ratio: { value: 1.0 },
                waveTexture: { value: waveTexture },
                spriteTexture: { value: spriteTexture },
                UV: { value: 340.0 / 1024.0 },
                mousePosition: { value: new Vector2(0, 0) },
                intro: { value: 0 },
            },
            vertexShader: /*glsl*/ `

            uniform float time;
            uniform float ratio;
            uniform sampler2D waveTexture;
            uniform vec2 mousePosition;
            uniform float intro;
            attribute vec2 randomUV;
            attribute float size;
            attribute float rotation; 
            attribute float random; 
            varying vec2 vRandomUV;
            varying float vRotation;
            varying float vRandom;
            varying vec3 vWP;



            void main() {
                vec3 pos = position;
                vRandomUV = randomUV;
                vRotation = rotation; 
                vRandom = random;
                pos.x += intro*10.*random;
                

                vec2 diff = pos.xy - mousePosition;
                float distanceToMouse = length(diff);
                vec2 dirToMouse = normalize(diff);

                float movementX = sin(time + pos.x) * 0.1; 
                pos.x += movementX; 
                pos.z += movementX;



                float wave1 = cos(1.0 * pos.x + time);
                float wave2 = sin(0.4 * pos.x + 0.8 * pos.z + time * 0.6);
                pos.y += wave1 * 0.6;
                pos.y += wave2 * 0.6;
                vWP = pos;
                vec4 fp = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);


                float dx = fp.x - mousePosition.x*fp.z;
                float dy = fp.y + mousePosition.y*fp.z ;
                float r = 2.;
                float d = r - sqrt(dx*dx + dy*dy);
                if(d>r) d = r; 
                if(d<0.) d = 0.;
                float a = atan(dy,dx);
                // float r2 = .5 * fp.z;
                float cc = (cos(time)+1.)*0.5;
                // float r2 = (0.08+cc*0.08) * fp.z;
                float r2 = random * 0.12 * fp.z;
                fp.x += r2 * cos(a) ;
                fp.y +=  r2 * sin(a) * ratio;
                // fp.z=1.;
                // fp.w=1.;
                //pos.x+= d ;
                // pos.x += dx * 0.1; 
                // pos.y += dy * 0.1;
            
                gl_PointSize = size;
                gl_Position = fp;
            }
            `,
            fragmentShader: /* glsl */ `
            uniform sampler2D spriteTexture;
            uniform float intro;
            varying vec2 vRandomUV;
            varying float vRotation;
            varying float vRandom; 
            varying vec3 vWP;
            
            void main() {
                vec2 uv = gl_PointCoord;
                vec2 center = vec2(0.5, 0.5);

                float cosR = cos(vRotation);
                float sinR = sin(vRotation);
                vec2 rotatedCoord = vec2(
                    cosR * (uv.x - center.x) - sinR * (uv.y - center.y),
                    sinR * (uv.x - center.x) + cosR * (uv.y - center.y)
                );
                
                if (vRandom < 0.01) {
                    discard;
                }

                vec2 finalUV = rotatedCoord + center;
                finalUV = finalUV * (340.0 / 1024.0) + vRandomUV;

                float distance = length(uv - center);

                float haloRadius = 0.4; 
                float edgeSoftness = 1.; 
                float haloIntensity = smoothstep(haloRadius, haloRadius - edgeSoftness, distance);

                vec4 color = texture2D(spriteTexture, finalUV);

                vec3 yellow = vec3(1, .7, 0.1); 
                vec3 white = vec3(1., .8, .2);   
                color.rgb = mix(yellow, white, step(.6, vRandom)); 

                color.rgb *= mix(1.0, 0.5, haloIntensity);
                color.a *= 1.0 - haloIntensity;
                color.a *= pow(vRandom, 1.2);
                color.rgb *= 0.18 * (vWP.x * 0.2 + 0.8);
                float a = 1. - intro;
                a=pow(a, 3.);
                color.a *= a;
                
                gl_FragColor = color;
            }
            `,
        };
        super(params);
    }
}
