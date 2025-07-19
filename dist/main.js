/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tweenjs/tween.js */ "./node_modules/@tweenjs/tween.js/dist/tween.esm.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");



class ThreeJSContainer {
    scene;
    light;
    cloud;
    cloud2;
    particleVelocity;
    group;
    group2;
    constructor() {
    }
    // 画面部分の作成(表示する枠ごとに)*
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_2__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_2__.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする
        //カメラの設定
        const camera = new three__WEBPACK_IMPORTED_MODULE_2__.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, 0));
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__.OrbitControls(camera, renderer.domElement);
        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render = (time) => {
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_2__.Color(0x000000));
        return renderer.domElement;
    };
    // シーンの作成(全体で1回)
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_2__.Scene();
        // 床　メッシュ
        const boxGeo = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(25, 25, 12);
        const PlaneMtl = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({ color: 0x131313, side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide, });
        const PlaneMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(boxGeo, PlaneMtl);
        PlaneMesh.rotation.x = -Math.PI / 2;
        PlaneMesh.position.y = -6.2;
        this.scene.add(PlaneMesh);
        // 魔法陣パーティクル　マテリアル　map
        let generateSprite = () => {
            //新しいキャンバスの作成
            let canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
            //円形のグラデーションの作成
            let context = canvas.getContext('2d');
            let gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.2, 'rgba(255,0,0,1)');
            gradient.addColorStop(0.4, 'rgba(64,0,0,1)');
            gradient.addColorStop(1, 'rgba(0,0,0,1)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
            //テクスチャの生成
            let texture = new three__WEBPACK_IMPORTED_MODULE_2__.Texture(canvas);
            texture.needsUpdate = true;
            return texture;
        };
        // 魔法陣パーティクル　関数
        let createParticles = () => {
            //ジオメトリの作成
            const geometry = new three__WEBPACK_IMPORTED_MODULE_2__.BufferGeometry();
            //マテリアルの作成
            let material = new three__WEBPACK_IMPORTED_MODULE_2__.PointsMaterial({
                color: new three__WEBPACK_IMPORTED_MODULE_2__.Color(1, 0, 0),
                size: 0.1,
                transparent: true,
                blending: three__WEBPACK_IMPORTED_MODULE_2__.AdditiveBlending,
                depthWrite: false,
                map: generateSprite()
            });
            //particleの作成
            const particleNum = 2210; // パーティクルの数
            const positions = new Float32Array(particleNum * 3);
            let particleIndex = 0;
            // 円座標
            let circle = (p, seg) => {
                for (let i = 0; i < seg; i++) {
                    positions[particleIndex++] = p * Math.cos((2 * Math.PI) / seg * i);
                    positions[particleIndex++] = 0;
                    positions[particleIndex++] = p * Math.sin((2 * Math.PI) / seg * i);
                }
            };
            // 六芒星座標
            let hexagram = (p, seg) => {
                const segmentCount = seg;
                // 三角形2つの基準点 (0,8) と (0,-8)
                const centers = [
                    { x: 0, y: p },
                    { x: 0, y: -p } // 下側三角形
                ];
                for (let j = 0; j < centers.length; j++) {
                    const cx = centers[j].x;
                    const cy = centers[j].y;
                    // 頂点3点を回転で取得
                    const triangle = [];
                    for (let k = 0; k < 3; k++) {
                        const theta = (2 * Math.PI) / 3 * k;
                        const x = cx * Math.cos(theta) - cy * Math.sin(theta);
                        const z = cx * Math.sin(theta) + cy * Math.cos(theta);
                        triangle.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(x, 0, z));
                    }
                    // 各辺を分割
                    for (let k = 0; k < 3; k++) {
                        const a = triangle[k];
                        const b = triangle[(k + 1) % 3];
                        for (let t = 0; t <= segmentCount; t++) {
                            const alpha = t / segmentCount;
                            positions[particleIndex++] = a.x * (1 - alpha) + b.x * alpha;
                            positions[particleIndex++] = 0;
                            positions[particleIndex++] = a.z * (1 - alpha) + b.z * alpha;
                        }
                    }
                }
            };
            circle(10.2, 300);
            circle(10, 250);
            hexagram(10, 110);
            hexagram(9.5, 100);
            circle(4.5, 140);
            hexagram(4.5, 40);
            geometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_2__.BufferAttribute(positions, 3));
            //THREE.Pointsの作成
            return new three__WEBPACK_IMPORTED_MODULE_2__.Points(geometry, material);
        };
        // 魔法陣パーティクル　メッシュ
        this.cloud = createParticles();
        this.scene.add(this.cloud);
        // 魔法陣パーティクル　アニメーション
        let MagicCircleGeometry = this.cloud.geometry;
        let positions = MagicCircleGeometry.getAttribute('position');
        let MagicCircleMaterial = this.cloud.material;
        for (let i = 0; i < positions.count; ++i) {
            positions.needsUpdate = true;
            // tweeninfoの作成
            let tweeninfo = { x: 0, y: 0, z: 0, index: i, size: 0.6 };
            // Tweenでパラメータの更新の際に呼び出される関数の作成
            let updatePointPosition = () => {
                positions.setX(tweeninfo.index, tweeninfo.x);
                positions.setY(tweeninfo.index, tweeninfo.y);
                positions.setZ(tweeninfo.index, tweeninfo.z);
                positions.needsUpdate = true;
            };
            let updatePointMaterial = () => {
                MagicCircleMaterial.size = tweeninfo.size;
            };
            // Twennの作成
            const msTween = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(tweeninfo).delay(500).to({ x: positions.getX(tweeninfo.index), y: positions.getY(tweeninfo.index), z: positions.getZ(tweeninfo.index) }, 1000).easing(_tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Easing.Circular.InOut).onUpdate(updatePointPosition);
            const zeroTween = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(tweeninfo).delay(10000).to({ x: 0, y: 0, z: 0 }, 1000).easing(_tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Easing.Circular.InOut).onUpdate(updatePointPosition);
            // materialの色のTween
            new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(MagicCircleMaterial.color)
                .delay(500)
                .to({ r: 1, g: 1, b: 1 }, 1000) // 白にフェード
                .easing(_tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Easing.Linear.None)
                .yoyo(true) // 戻る動作
                .repeat(Infinity) // 無限ループ
                .start();
            // materialの大きさのTween
            new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(tweeninfo)
                .delay(500)
                .to({ size: 1.2 }, 1000) // Pointのサイズを二倍に
                .easing(_tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Easing.Linear.None)
                .onUpdate(updatePointMaterial)
                .yoyo(true) // 戻る動作
                .repeat(Infinity) // 無限ループ
                .start();
            // アニメーションのループの作成
            msTween.chain(zeroTween);
            zeroTween.chain(msTween);
            // アニメーションの実行
            positions.setX(i, 0);
            positions.setY(i, 0);
            positions.setZ(i, 0);
            msTween.start();
        }
        // 魔法陣オブジェクトエフェクト　メッシュ
        const CylinderLightEffectGeo = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(10.7, 10.7, 10, 32, 1, true);
        CylinderLightEffectGeo.computeBoundingBox(); // バウンディングボックスの取得
        const CylinderLightEffectMtl = new three__WEBPACK_IMPORTED_MODULE_2__.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide,
            uniforms: {
                color: { value: new three__WEBPACK_IMPORTED_MODULE_2__.Color(1, 0, 0.5) },
                bboxMin: { value: CylinderLightEffectGeo.boundingBox.min },
                bboxMax: { value: CylinderLightEffectGeo.boundingBox.max }
            },
            vertexShader: `
            varying float vOpacity;
            uniform vec3 bboxMin;
            uniform vec3 bboxMax;
            
            void main() {
              float height = bboxMax.y - bboxMin.y;
              float yPos = position.y - bboxMin.y;
              vOpacity = smoothstep(0.0, 0.2, yPos / height ); // 下から上へのグラデーション
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
            uniform vec3 color;
            varying float vOpacity;
            
            void main() {
              gl_FragColor = vec4(color, vOpacity);
            }
             `
        });
        const CylinderLightEffect = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(CylinderLightEffectGeo, CylinderLightEffectMtl);
        CylinderLightEffect.position.y = -5;
        CylinderLightEffect.rotation.x = Math.PI;
        this.scene.add(CylinderLightEffect);
        // 魔法陣オブジェクトエフェクト　アニメーション
        let CylLigEffTweenInfo = { x: 0, y: -5, z: 0 };
        let updateCylLigEffPosition = () => {
            CylinderLightEffect.position.y = CylLigEffTweenInfo.y;
        };
        const CylLigEffUpTween = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(CylLigEffTweenInfo).delay(1000).to({ y: 3 }, 1500).easing(_tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Easing.Linear.None).onUpdate(updateCylLigEffPosition);
        const CylLigEffTweenBack = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(CylLigEffTweenInfo).delay(9000).to({ y: -5 }, 1000).easing(_tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Easing.Quartic.Out).onUpdate(updateCylLigEffPosition);
        CylLigEffUpTween.chain(CylLigEffTweenBack);
        CylLigEffTweenBack.chain(CylLigEffUpTween);
        CylLigEffUpTween.start();
        // materialの色のTween
        new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(CylinderLightEffectMtl.uniforms.color.value)
            .delay(500)
            .to({ r: 1, g: 0.5, b: 1 }, 1000) // 白にフェード
            .easing(_tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Easing.Linear.None)
            .yoyo(true) // 戻る動作
            .repeat(Infinity) // 無限ループ
            .start();
        // 魔法陣パーティクルエフェクト　メッシュ
        let createMSEParticles = () => {
            //ジオメトリの作成
            const geometry = new three__WEBPACK_IMPORTED_MODULE_2__.BufferGeometry();
            //マテリアルの作成
            const textureLoader = new three__WEBPACK_IMPORTED_MODULE_2__.TextureLoader();
            const texture = textureLoader.load('gate2.jpeg');
            const material = new three__WEBPACK_IMPORTED_MODULE_2__.PointsMaterial({ size: 1.5, map: texture, blending: three__WEBPACK_IMPORTED_MODULE_2__.AdditiveBlending, color: 0xff4e4e, depthWrite: false, transparent: true, opacity: 0.4 });
            //particleの作成
            const particleNum = 150; // パーティクルの数
            const positions = new Float32Array(particleNum * 3);
            let particleIndex = 0;
            this.particleVelocity = [];
            for (let x = 0; x < particleNum; x++) {
                const t = 2 * Math.PI * Math.random();
                const r = 11 * Math.random();
                positions[particleIndex++] = r * Math.cos(t); // x座標
                positions[particleIndex++] = -4; // y座標
                positions[particleIndex++] = r * Math.sin(t); // z座標
                this.particleVelocity.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, Math.random() * 3 + 1, 0));
            }
            geometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_2__.BufferAttribute(positions, 3));
            //THREE.Pointsの作成
            return new three__WEBPACK_IMPORTED_MODULE_2__.Points(geometry, material);
        };
        this.cloud2 = createMSEParticles();
        this.scene.add(this.cloud2);
        // 魔法陣パーティクルエフェクト　アニメーション
        let MagicCircleEffectGeometry = this.cloud2.geometry;
        let positions2 = MagicCircleEffectGeometry.getAttribute('position');
        const MagicCircleEffectMaterial = this.cloud2.material;
        for (let i = 0; i < positions2.count; ++i) {
            let tweeninfo2 = { x: 0, y: -1, z: 0, index: i };
            let updatePointPosition = () => {
                positions2.setY(tweeninfo2.index, tweeninfo2.y);
                positions2.needsUpdate = true;
            };
            const opacityInfo = { opacity: MagicCircleEffectMaterial.opacity };
            let updatePointOpacity = () => {
                MagicCircleEffectMaterial.opacity = opacityInfo.opacity;
            };
            const mseTween = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(tweeninfo2).to({ y: 15 }, 0).onUpdate(updatePointPosition);
            const mseMaterialTween = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(opacityInfo).delay(9500).to({ opacity: 0 }, 3000).onUpdate(updatePointOpacity);
            const mseMaterialTweenBack = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(opacityInfo).to({ opacity: 0.4 }, 0).onUpdate(updatePointOpacity);
            mseMaterialTween.chain(mseTween);
            mseTween.chain(mseMaterialTweenBack);
            mseMaterialTweenBack.chain(mseMaterialTween);
            mseMaterialTween.start();
        }
        // 召喚物メッシュ
        let Scarlet = new three__WEBPACK_IMPORTED_MODULE_2__.MeshLambertMaterial({ color: 0xBA2636 });
        let Black = new three__WEBPACK_IMPORTED_MODULE_2__.MeshLambertMaterial({ color: 0x2B2B2B });
        let Gold = new three__WEBPACK_IMPORTED_MODULE_2__.MeshLambertMaterial({ color: 0xFFD700 });
        let createGate = (color) => {
            let tempGroup = new three__WEBPACK_IMPORTED_MODULE_2__.Group();
            //柱
            let CylinderGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(0.5, 0.5, 8, 32);
            for (let i = -1; i < 2; i += 2) {
                let CylinderAdd = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(CylinderGeometry, color);
                CylinderAdd.position.z = 3 * i;
                CylinderAdd.position.y = 11;
                tempGroup.add(CylinderAdd);
            }
            //台輪
            let CylinderGeometry2 = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(0.7, 0.7, 0.3, 32);
            for (let i = -1; i < 2; i += 2) {
                let CylinderAdd = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(CylinderGeometry2, color);
                CylinderAdd.position.z = 3 * i;
                CylinderAdd.position.y = 15;
                tempGroup.add(CylinderAdd);
            }
            //貫
            let BoxGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(11, 0.5, 0.5, 32);
            let BoxAdd = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(BoxGeometry, color);
            BoxAdd.position.y = 13.5;
            BoxAdd.rotation.y = three__WEBPACK_IMPORTED_MODULE_2__.MathUtils.degToRad(90);
            tempGroup.add(BoxAdd);
            //島木
            let BoxGeometry2 = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(12, 0.5, 1, 32);
            let BoxAdd2 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(BoxGeometry2, color);
            BoxAdd2.position.y = 15.4;
            BoxAdd2.rotation.y = three__WEBPACK_IMPORTED_MODULE_2__.MathUtils.degToRad(90);
            tempGroup.add(BoxAdd2);
            //笠木
            let BoxGeometry3 = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(13, 0.5, 1.5, 32);
            let BoxAdd3 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(BoxGeometry3, Black);
            BoxAdd3.position.y = 15.9;
            BoxAdd3.rotation.y = three__WEBPACK_IMPORTED_MODULE_2__.MathUtils.degToRad(90);
            tempGroup.add(BoxAdd3);
            //薬座
            let ConeGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.ConeGeometry(0.7, 0.7, 32);
            let CylinderGeometry3 = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(0.7, 0.7, 1.5, 32);
            for (let i = -1; i < 2; i += 2) {
                let ConeAdd = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(ConeGeometry, Black);
                ConeAdd.position.z = 3 * i;
                ConeAdd.position.y = 8.8;
                tempGroup.add(ConeAdd);
                let CylinderAdd3 = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(CylinderGeometry3, Black);
                CylinderAdd3.position.z = 3 * i;
                CylinderAdd3.position.y = 7.7;
                tempGroup.add(CylinderAdd3);
            }
            return tempGroup;
        };
        this.group = createGate(Gold);
        this.group.position.y = -19;
        this.scene.add(this.group);
        // 召喚物アニメーション
        let boxTweenInfo = { x: 0, y: -17, z: 0 };
        let updateBoxPosition = () => {
            this.group.position.y = boxTweenInfo.y;
        };
        const boxUpTween = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(boxTweenInfo).delay(5500).to({ y: -5 }, 2000).easing(_tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Easing.Quadratic.InOut).onUpdate(updateBoxPosition);
        const boxTween1 = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(boxTweenInfo).delay(3000).to({ y: -7 }, 200).easing(_tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Easing.Circular.Out).onUpdate(updateBoxPosition);
        const boxTween2 = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(boxTweenInfo).to({ y: 12 }, 800).easing(_tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Easing.Linear.None).onUpdate(updateBoxPosition);
        const boxTween3 = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(boxTweenInfo).to({ y: -19 }, 1000).easing(_tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Easing.Exponential.Out).onUpdate(updateBoxPosition);
        boxUpTween.chain(boxTween1);
        boxTween1.chain(boxTween2);
        boxTween2.chain(boxTween3);
        boxTween3.chain(boxUpTween);
        boxUpTween.start();
        // 装飾（鳥居）
        let group2s = [];
        let thetas = [];
        for (let i = 0; i < 15; i++) {
            this.group2 = createGate(Scarlet);
            let theta = 2 * Math.PI * i / 15;
            this.group2.position.x = 25 * Math.sin(theta);
            this.group2.position.y = -10 - 5 * Math.sin(theta);
            this.group2.rotation.y = theta;
            this.group2.position.z = 25 * Math.cos(theta);
            group2s.push(this.group2);
            thetas.push(theta);
            this.scene.add(this.group2);
        }
        // 装飾（正八面体）
        let addRandomRing = () => {
            let RingGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.OctahedronGeometry(2);
            let RingMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshLambertMaterial({ color: new three__WEBPACK_IMPORTED_MODULE_2__.Color(Math.random() * 0.5 + 0.5, 0, Math.random()) });
            let RingAdd = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(RingGeometry, RingMaterial);
            let r = 100 + 100 * Math.random();
            let U = Math.PI * 2 * Math.random();
            let V = Math.PI * 2 * Math.random() - Math.PI;
            RingAdd.position.x = r * Math.cos(U) * Math.cos(V);
            RingAdd.position.y = r * Math.sin(U) * Math.cos(V);
            RingAdd.position.z = r * Math.sin(V);
            RingAdd.rotation.y = three__WEBPACK_IMPORTED_MODULE_2__.MathUtils.degToRad(Math.random() * 360);
            this.scene.add(RingAdd);
        };
        for (let i = 0; i < 1000; i++) {
            addRandomRing();
        }
        // 召喚物内プレートテクスチャ
        const planeGeom = new three__WEBPACK_IMPORTED_MODULE_2__.PlaneBufferGeometry(5, 6.7);
        const loader = new three__WEBPACK_IMPORTED_MODULE_2__.TextureLoader();
        const texture = loader.load('gate2.jpeg');
        const planeMtl = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({ map: texture });
        const plane = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(planeGeom, planeMtl);
        plane.position.y = 10.3;
        plane.rotation.y = Math.PI / 2;
        this.group.add(plane);
        //ライトの設定
        this.light = new three__WEBPACK_IMPORTED_MODULE_2__.DirectionalLight(0xffffff);
        const lvec = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(1, 1, 1).clone().normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let t = 0;
        let d = 0;
        let d2 = 0;
        const clock = new three__WEBPACK_IMPORTED_MODULE_2__.Clock();
        let update = (time) => {
            const deltaTime = clock.getDelta();
            t = Math.PI / 2.5 * deltaTime;
            _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.update(time);
            for (let i = 0; i < positions.count; i++) {
                if (i >= 1822)
                    t = -Math.PI / 2.5 * deltaTime;
                positions.setX(i, positions.getX(i) * Math.cos(t) - positions.getZ(i) * Math.sin(t));
                positions.setY(i, positions.getY(i));
                positions.setZ(i, positions.getZ(i) * Math.cos(t) + positions.getX(i) * Math.sin(t));
                positions.needsUpdate = true;
            }
            const geom = this.cloud2.geometry;
            const pos = geom.getAttribute('position');
            for (let i = 0; i < pos.count; i++) {
                pos.setY(i, pos.getY(i) + this.particleVelocity[i].y * deltaTime);
                if (pos.getY(i) >= 14) {
                    pos.setY(i, -4);
                }
            }
            pos.needsUpdate = true;
            const pgeom = plane.geometry;
            d += t * 3;
            if (d > Math.PI * 2)
                d = 0;
            const r = 0.8 + Math.sin(Math.PI + d) / 10;
            const uvs = new Float32Array([
                r * Math.cos(Math.PI * 5 / 4 + d) * Math.sqrt(2) * 0.5 + 0.5, r * Math.sin(Math.PI * 5 / 4 + d) * Math.sqrt(2) * 0.5 + 0.5,
                r * Math.cos(Math.PI * 7 / 4 + d) * Math.sqrt(2) * 0.5 + 0.5, r * Math.sin(Math.PI * 7 / 4 + d) * Math.sqrt(2) * 0.5 + 0.5,
                r * Math.cos(Math.PI * 3 / 4 + d) * Math.sqrt(2) * 0.5 + 0.5, r * Math.sin(Math.PI * 3 / 4 + d) * Math.sqrt(2) * 0.5 + 0.5,
                r * Math.cos(Math.PI / 4 + d) * Math.sqrt(2) * 0.5 + 0.5, r * Math.sin(Math.PI / 4 + d) * Math.sqrt(2) * 0.5 + 0.5,
            ]);
            pgeom.setAttribute('uv', new three__WEBPACK_IMPORTED_MODULE_2__.BufferAttribute(uvs, 2));
            d2 += t;
            for (let i = 0; i < group2s.length; i++) {
                group2s[i].position.y = -16 - 2 * Math.sin(thetas[i] + d2);
            }
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(18, 10, 30));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_tweenjs_tween_js_dist_tween_esm_js-node_modules_three_examples_jsm_contr-78d392"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHO2dCQUMxSCxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHO2dCQUMxSCxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRzthQUNySCxDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLGtEQUFxQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTVELEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDUixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDckMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQzVEO1lBRUQscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUNELHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Q0FHSjtBQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUVsRCxTQUFTLElBQUk7SUFDVCxJQUFJLFNBQVMsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7SUFFdkMsSUFBSSxRQUFRLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSwwQ0FBYSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwRixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4QyxDQUFDOzs7Ozs7O1VDemdCRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsK0JBQStCLHdDQUF3QztXQUN2RTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlCQUFpQixxQkFBcUI7V0FDdEM7V0FDQTtXQUNBLGtCQUFrQixxQkFBcUI7V0FDdkM7V0FDQTtXQUNBLEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NncHJlbmRlcmluZy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCAqIGFzIFRXRUVOIGZyb20gXCJAdHdlZW5qcy90d2Vlbi5qc1wiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xuXG5jbGFzcyBUaHJlZUpTQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5MaWdodDtcbiAgICBwcml2YXRlIGNsb3VkOiBUSFJFRS5Qb2ludHM7XG4gICAgcHJpdmF0ZSBjbG91ZDI6IFRIUkVFLlBvaW50cztcbiAgICBwcml2YXRlIHBhcnRpY2xlVmVsb2NpdHk6IFRIUkVFLlZlY3RvcjNbXTtcbiAgICBwcml2YXRlIGdyb3VwOiBUSFJFRS5Hcm91cDtcbiAgICBwcml2YXRlIGdyb3VwMjogVEhSRUUuR3JvdXA7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIC8vIOeUu+mdoumDqOWIhuOBruS9nOaIkCjooajnpLrjgZnjgovmnqDjgZTjgajjgaspKlxuICAgIHB1YmxpYyBjcmVhdGVSZW5kZXJlckRPTSA9ICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgY2FtZXJhUG9zOiBUSFJFRS5WZWN0b3IzKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHg0OTVlZCkpO1xuICAgICAgICByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IHRydWU7IC8v44K344Oj44OJ44Km44Oe44OD44OX44KS5pyJ5Yq544Gr44GZ44KLXG5cbiAgICAgICAgLy/jgqvjg6Hjg6njga7oqK3lrppcbiAgICAgICAgY29uc3QgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aWR0aCAvIGhlaWdodCwgMC4xLCAxMDAwKTtcbiAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkoY2FtZXJhUG9zKTtcbiAgICAgICAgY2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKSk7XG5cbiAgICAgICAgY29uc3Qgb3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVTY2VuZSgpO1xuICAgICAgICAvLyDmr47jg5Xjg6zjg7zjg6Djga51cGRhdGXjgpLlkbzjgpPjgafvvIxyZW5kZXJcbiAgICAgICAgLy8gcmVxZXN0QW5pbWF0aW9uRnJhbWUg44Gr44KI44KK5qyh44OV44Os44O844Og44KS5ZG844G2XG4gICAgICAgIGNvbnN0IHJlbmRlcjogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuICAgICAgICAgICAgb3JiaXRDb250cm9scy51cGRhdGUoKTtcblxuICAgICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIGNhbWVyYSk7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcblxuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLmNzc0Zsb2F0ID0gXCJsZWZ0XCI7XG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIxMHB4XCI7XG4gICAgICAgIHJlbmRlcmVyLnNldENsZWFyQ29sb3IobmV3IFRIUkVFLkNvbG9yKDB4MDAwMDAwKSk7XG4gICAgICAgIHJldHVybiByZW5kZXJlci5kb21FbGVtZW50O1xuICAgIH1cblxuICAgIC8vIOOCt+ODvOODs+OBruS9nOaIkCjlhajkvZPjgacx5ZueKVxuICAgIHByaXZhdGUgY3JlYXRlU2NlbmUgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuXG4gICAgICAgIC8vIOW6iuOAgOODoeODg+OCt+ODpVxuICAgICAgICBjb25zdCBib3hHZW8gPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoMjUsIDI1LCAxMik7XG4gICAgICAgIGNvbnN0IFBsYW5lTXRsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IDB4MTMxMzEzLCBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLCB9KTtcbiAgICAgICAgY29uc3QgUGxhbmVNZXNoID0gbmV3IFRIUkVFLk1lc2goYm94R2VvLCBQbGFuZU10bCk7XG4gICAgICAgIFBsYW5lTWVzaC5yb3RhdGlvbi54ID0gLU1hdGguUEkgLyAyO1xuICAgICAgICBQbGFuZU1lc2gucG9zaXRpb24ueSA9IC0gNi4yO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChQbGFuZU1lc2gpO1xuXG5cbiAgICAgICAgLy8g6a2U5rOV6Zmj44OR44O844OG44Kj44Kv44Or44CA44Oe44OG44Oq44Ki44Or44CAbWFwXG4gICAgICAgIGxldCBnZW5lcmF0ZVNwcml0ZSA9ICgpID0+IHtcbiAgICAgICAgICAgIC8v5paw44GX44GE44Kt44Oj44Oz44OQ44K544Gu5L2c5oiQXG4gICAgICAgICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgICBjYW52YXMud2lkdGggPSAxNjtcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSAxNjtcblxuICAgICAgICAgICAgLy/lhoblvaLjga7jgrDjg6njg4fjg7zjgrfjg6fjg7Pjga7kvZzmiJBcbiAgICAgICAgICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICBsZXQgZ3JhZGllbnQgPSBjb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KGNhbnZhcy53aWR0aCAvIDIsIGNhbnZhcy5oZWlnaHQgLyAyLCAwLCBjYW52YXMud2lkdGggLyAyLCBjYW52YXMuaGVpZ2h0IC8gMiwgY2FudmFzLndpZHRoIC8gMik7XG4gICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMjU1LDI1NSwyNTUsMSknKTtcbiAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjIsICdyZ2JhKDI1NSwwLDAsMSknKTtcbiAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjQsICdyZ2JhKDY0LDAsMCwxKScpO1xuICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDAsMCwwLDEpJyk7XG5cbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgICAgICAvL+ODhuOCr+OCueODgeODo+OBrueUn+aIkFxuICAgICAgICAgICAgbGV0IHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShjYW52YXMpO1xuICAgICAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGV4dHVyZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOmtlOazlemZo+ODkeODvOODhuOCo+OCr+ODq+OAgOmWouaVsFxuICAgICAgICBsZXQgY3JlYXRlUGFydGljbGVzID0gKCkgPT4ge1xuICAgICAgICAgICAgLy/jgrjjgqrjg6Hjg4jjg6rjga7kvZzmiJBcbiAgICAgICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XG4gICAgICAgICAgICAvL+ODnuODhuODquOCouODq+OBruS9nOaIkFxuICAgICAgICAgICAgbGV0IG1hdGVyaWFsID0gbmV3IFRIUkVFLlBvaW50c01hdGVyaWFsKHtcbiAgICAgICAgICAgICAgICBjb2xvcjogbmV3IFRIUkVFLkNvbG9yKDEsIDAsIDApLFxuICAgICAgICAgICAgICAgIHNpemU6IDAuMSxcbiAgICAgICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyxcbiAgICAgICAgICAgICAgICBkZXB0aFdyaXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBtYXA6IGdlbmVyYXRlU3ByaXRlKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9wYXJ0aWNsZeOBruS9nOaIkFxuICAgICAgICAgICAgY29uc3QgcGFydGljbGVOdW0gPSAyMjEwIC8vIOODkeODvOODhuOCo+OCr+ODq+OBruaVsFxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheShwYXJ0aWNsZU51bSAqIDMpO1xuICAgICAgICAgICAgbGV0IHBhcnRpY2xlSW5kZXggPSAwO1xuXG4gICAgICAgICAgICAvLyDlhobluqfmqJlcbiAgICAgICAgICAgIGxldCBjaXJjbGUgPSAocDogbnVtYmVyLCBzZWc6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VnOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zW3BhcnRpY2xlSW5kZXgrK10gPSBwICogTWF0aC5jb3MoKDIgKiBNYXRoLlBJKSAvIHNlZyAqIGkpO1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnNbcGFydGljbGVJbmRleCsrXSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uc1twYXJ0aWNsZUluZGV4KytdID0gcCAqIE1hdGguc2luKCgyICogTWF0aC5QSSkgLyBzZWcgKiBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWFreiKkuaYn+W6p+aomVxuICAgICAgICAgICAgbGV0IGhleGFncmFtID0gKHA6IG51bWJlciwgc2VnOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWdtZW50Q291bnQgPSBzZWc7XG4gICAgICAgICAgICAgICAgLy8g5LiJ6KeS5b2iMuOBpOOBruWfuua6lueCuSAoMCw4KSDjgaggKDAsLTgpXG4gICAgICAgICAgICAgICAgY29uc3QgY2VudGVycyA9IFtcbiAgICAgICAgICAgICAgICAgICAgeyB4OiAwLCB5OiBwIH0sICAvLyDkuIrlgbTkuInop5LlvaJcbiAgICAgICAgICAgICAgICAgICAgeyB4OiAwLCB5OiAtcCB9ICAgLy8g5LiL5YG05LiJ6KeS5b2iXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNlbnRlcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3ggPSBjZW50ZXJzW2pdLng7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN5ID0gY2VudGVyc1tqXS55O1xuICAgICAgICAgICAgICAgICAgICAvLyDpoILngrkz54K544KS5Zue6Lui44Gn5Y+W5b6XXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyaWFuZ2xlID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgMzsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0aGV0YSA9ICgyICogTWF0aC5QSSkgLyAzICogaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSBjeCAqIE1hdGguY29zKHRoZXRhKSAtIGN5ICogTWF0aC5zaW4odGhldGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeiA9IGN4ICogTWF0aC5zaW4odGhldGEpICsgY3kgKiBNYXRoLmNvcyh0aGV0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmlhbmdsZS5wdXNoKG5ldyBUSFJFRS5WZWN0b3IzKHgsIDAsIHopKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyDlkITovrrjgpLliIblibJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCAzOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGEgPSB0cmlhbmdsZVtrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGIgPSB0cmlhbmdsZVsoayArIDEpICUgM107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHQgPSAwOyB0IDw9IHNlZ21lbnRDb3VudDsgdCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxwaGEgPSB0IC8gc2VnbWVudENvdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uc1twYXJ0aWNsZUluZGV4KytdID0gYS54ICogKDEgLSBhbHBoYSkgKyBiLnggKiBhbHBoYTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnNbcGFydGljbGVJbmRleCsrXSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zW3BhcnRpY2xlSW5kZXgrK10gPSBhLnogKiAoMSAtIGFscGhhKSArIGIueiAqIGFscGhhO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNpcmNsZSgxMC4yLCAzMDApO1xuICAgICAgICAgICAgY2lyY2xlKDEwLCAyNTApO1xuICAgICAgICAgICAgaGV4YWdyYW0oMTAsIDExMCk7XG4gICAgICAgICAgICBoZXhhZ3JhbSg5LjUsIDEwMCk7XG4gICAgICAgICAgICBjaXJjbGUoNC41LCAxNDApO1xuICAgICAgICAgICAgaGV4YWdyYW0oNC41LCA0MCk7XG5cbiAgICAgICAgICAgIGdlb21ldHJ5LnNldEF0dHJpYnV0ZSgncG9zaXRpb24nLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKHBvc2l0aW9ucywgMykpO1xuICAgICAgICAgICAgLy9USFJFRS5Qb2ludHPjga7kvZzmiJBcbiAgICAgICAgICAgIHJldHVybiBuZXcgVEhSRUUuUG9pbnRzKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDprZTms5XpmaPjg5Hjg7zjg4bjgqPjgq/jg6vjgIDjg6Hjg4Pjgrfjg6VcbiAgICAgICAgdGhpcy5jbG91ZCA9IGNyZWF0ZVBhcnRpY2xlcygpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmNsb3VkKTtcblxuICAgICAgICAvLyDprZTms5XpmaPjg5Hjg7zjg4bjgqPjgq/jg6vjgIDjgqLjg4vjg6Hjg7zjgrfjg6fjg7NcbiAgICAgICAgbGV0IE1hZ2ljQ2lyY2xlR2VvbWV0cnkgPSA8VEhSRUUuQnVmZmVyR2VvbWV0cnk+dGhpcy5jbG91ZC5nZW9tZXRyeTtcbiAgICAgICAgbGV0IHBvc2l0aW9ucyA9IE1hZ2ljQ2lyY2xlR2VvbWV0cnkuZ2V0QXR0cmlidXRlKCdwb3NpdGlvbicpO1xuICAgICAgICBsZXQgTWFnaWNDaXJjbGVNYXRlcmlhbCA9IDxUSFJFRS5Qb2ludHNNYXRlcmlhbD50aGlzLmNsb3VkLm1hdGVyaWFsO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc2l0aW9ucy5jb3VudDsgKytpKSB7XG4gICAgICAgICAgICBwb3NpdGlvbnMubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgLy8gdHdlZW5pbmZv44Gu5L2c5oiQXG4gICAgICAgICAgICBsZXQgdHdlZW5pbmZvID0geyB4OiAwLCB5OiAwLCB6OiAwLCBpbmRleDogaSwgc2l6ZTogMC42IH07XG4gICAgICAgICAgICAvLyBUd2VlbuOBp+ODkeODqeODoeODvOOCv+OBruabtOaWsOOBrumam+OBq+WRvOOBs+WHuuOBleOCjOOCi+mWouaVsOOBruS9nOaIkFxuICAgICAgICAgICAgbGV0IHVwZGF0ZVBvaW50UG9zaXRpb24gPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25zLnNldFgodHdlZW5pbmZvLmluZGV4LCB0d2VlbmluZm8ueCk7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25zLnNldFkodHdlZW5pbmZvLmluZGV4LCB0d2VlbmluZm8ueSk7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25zLnNldFoodHdlZW5pbmZvLmluZGV4LCB0d2VlbmluZm8ueik7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25zLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB1cGRhdGVQb2ludE1hdGVyaWFsID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIE1hZ2ljQ2lyY2xlTWF0ZXJpYWwuc2l6ZSA9IHR3ZWVuaW5mby5zaXplO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVHdlbm7jga7kvZzmiJBcbiAgICAgICAgICAgIGNvbnN0IG1zVHdlZW4gPSBuZXcgVFdFRU4uVHdlZW4odHdlZW5pbmZvKS5kZWxheSg1MDApLnRvKHsgeDogcG9zaXRpb25zLmdldFgodHdlZW5pbmZvLmluZGV4KSwgeTogcG9zaXRpb25zLmdldFkodHdlZW5pbmZvLmluZGV4KSwgejogcG9zaXRpb25zLmdldFoodHdlZW5pbmZvLmluZGV4KSB9LCAxMDAwKS5lYXNpbmcoVFdFRU4uRWFzaW5nLkNpcmN1bGFyLkluT3V0KS5vblVwZGF0ZSh1cGRhdGVQb2ludFBvc2l0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHplcm9Ud2VlbiA9IG5ldyBUV0VFTi5Ud2Vlbih0d2VlbmluZm8pLmRlbGF5KDEwMDAwKS50byh7IHg6IDAsIHk6IDAsIHo6IDAgfSwgMTAwMCkuZWFzaW5nKFRXRUVOLkVhc2luZy5DaXJjdWxhci5Jbk91dCkub25VcGRhdGUodXBkYXRlUG9pbnRQb3NpdGlvbik7XG4gICAgICAgICAgICAvLyBtYXRlcmlhbOOBruiJsuOBrlR3ZWVuXG4gICAgICAgICAgICBuZXcgVFdFRU4uVHdlZW4oTWFnaWNDaXJjbGVNYXRlcmlhbC5jb2xvcilcbiAgICAgICAgICAgICAgICAuZGVsYXkoNTAwKVxuICAgICAgICAgICAgICAgIC50byh7IHI6IDEsIGc6IDEsIGI6IDEgfSwgMTAwMCkgICAgICAgICAgIC8vIOeZveOBq+ODleOCp+ODvOODiVxuICAgICAgICAgICAgICAgIC5lYXNpbmcoVFdFRU4uRWFzaW5nLkxpbmVhci5Ob25lKVxuICAgICAgICAgICAgICAgIC55b3lvKHRydWUpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5oi744KL5YuV5L2cXG4gICAgICAgICAgICAgICAgLnJlcGVhdChJbmZpbml0eSkgICAgICAgICAgICAgICAgICAgICAgICAvLyDnhKHpmZDjg6vjg7zjg5dcbiAgICAgICAgICAgICAgICAuc3RhcnQoKTtcbiAgICAgICAgICAgIC8vIG1hdGVyaWFs44Gu5aSn44GN44GV44GuVHdlZW5cbiAgICAgICAgICAgIG5ldyBUV0VFTi5Ud2Vlbih0d2VlbmluZm8pXG4gICAgICAgICAgICAgICAgLmRlbGF5KDUwMClcbiAgICAgICAgICAgICAgICAudG8oeyBzaXplOiAxLjIgfSwgMTAwMCkgICAgICAgICAgICAgICAgICAvLyBQb2ludOOBruOCteOCpOOCuuOCkuS6jOWAjeOBq1xuICAgICAgICAgICAgICAgIC5lYXNpbmcoVFdFRU4uRWFzaW5nLkxpbmVhci5Ob25lKVxuICAgICAgICAgICAgICAgIC5vblVwZGF0ZSh1cGRhdGVQb2ludE1hdGVyaWFsKVxuICAgICAgICAgICAgICAgIC55b3lvKHRydWUpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5oi744KL5YuV5L2cXG4gICAgICAgICAgICAgICAgLnJlcGVhdChJbmZpbml0eSkgICAgICAgICAgICAgICAgICAgICAgICAvLyDnhKHpmZDjg6vjg7zjg5dcbiAgICAgICAgICAgICAgICAuc3RhcnQoKTtcbiAgICAgICAgICAgIC8vIOOCouODi+ODoeODvOOCt+ODp+ODs+OBruODq+ODvOODl+OBruS9nOaIkFxuICAgICAgICAgICAgbXNUd2Vlbi5jaGFpbih6ZXJvVHdlZW4pO1xuICAgICAgICAgICAgemVyb1R3ZWVuLmNoYWluKG1zVHdlZW4pO1xuICAgICAgICAgICAgLy8g44Ki44OL44Oh44O844K344On44Oz44Gu5a6f6KGMXG4gICAgICAgICAgICBwb3NpdGlvbnMuc2V0WChpLCAwKTtcbiAgICAgICAgICAgIHBvc2l0aW9ucy5zZXRZKGksIDApO1xuICAgICAgICAgICAgcG9zaXRpb25zLnNldFooaSwgMCk7XG4gICAgICAgICAgICBtc1R3ZWVuLnN0YXJ0KCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIOmtlOazlemZo+OCquODluOCuOOCp+OCr+ODiOOCqOODleOCp+OCr+ODiOOAgOODoeODg+OCt+ODpVxuICAgICAgICBjb25zdCBDeWxpbmRlckxpZ2h0RWZmZWN0R2VvID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMTAuNywgMTAuNywgMTAsIDMyLCAxLCB0cnVlKTtcbiAgICAgICAgQ3lsaW5kZXJMaWdodEVmZmVjdEdlby5jb21wdXRlQm91bmRpbmdCb3goKTsgICAvLyDjg5Djgqbjg7Pjg4fjgqPjg7PjgrDjg5zjg4Pjgq/jgrnjga7lj5blvpdcbiAgICAgICAgY29uc3QgQ3lsaW5kZXJMaWdodEVmZmVjdE10bCA9IG5ldyBUSFJFRS5TaGFkZXJNYXRlcmlhbCh7XG4gICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgIGRlcHRoV3JpdGU6IGZhbHNlLFxuICAgICAgICAgICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcbiAgICAgICAgICAgIHVuaWZvcm1zOiB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHsgdmFsdWU6IG5ldyBUSFJFRS5Db2xvcigxLCAwLCAwLjUpIH0sXG4gICAgICAgICAgICAgICAgYmJveE1pbjogeyB2YWx1ZTogQ3lsaW5kZXJMaWdodEVmZmVjdEdlby5ib3VuZGluZ0JveC5taW4gfSxcbiAgICAgICAgICAgICAgICBiYm94TWF4OiB7IHZhbHVlOiBDeWxpbmRlckxpZ2h0RWZmZWN0R2VvLmJvdW5kaW5nQm94Lm1heCB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmVydGV4U2hhZGVyOlxuICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgIHZhcnlpbmcgZmxvYXQgdk9wYWNpdHk7XG4gICAgICAgICAgICB1bmlmb3JtIHZlYzMgYmJveE1pbjtcbiAgICAgICAgICAgIHVuaWZvcm0gdmVjMyBiYm94TWF4O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgICAgICAgIGZsb2F0IGhlaWdodCA9IGJib3hNYXgueSAtIGJib3hNaW4ueTtcbiAgICAgICAgICAgICAgZmxvYXQgeVBvcyA9IHBvc2l0aW9uLnkgLSBiYm94TWluLnk7XG4gICAgICAgICAgICAgIHZPcGFjaXR5ID0gc21vb3Roc3RlcCgwLjAsIDAuMiwgeVBvcyAvIGhlaWdodCApOyAvLyDkuIvjgYvjgonkuIrjgbjjga7jgrDjg6njg4fjg7zjgrfjg6fjg7NcbiAgICAgICAgICAgICAgZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogdmVjNChwb3NpdGlvbiwgMS4wKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYCxcbiAgICAgICAgICAgIGZyYWdtZW50U2hhZGVyOlxuICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgIHVuaWZvcm0gdmVjMyBjb2xvcjtcbiAgICAgICAgICAgIHZhcnlpbmcgZmxvYXQgdk9wYWNpdHk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChjb2xvciwgdk9wYWNpdHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgIGBcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IEN5bGluZGVyTGlnaHRFZmZlY3QgPSBuZXcgVEhSRUUuTWVzaChDeWxpbmRlckxpZ2h0RWZmZWN0R2VvLCBDeWxpbmRlckxpZ2h0RWZmZWN0TXRsKTtcbiAgICAgICAgQ3lsaW5kZXJMaWdodEVmZmVjdC5wb3NpdGlvbi55ID0gLTU7XG4gICAgICAgIEN5bGluZGVyTGlnaHRFZmZlY3Qucm90YXRpb24ueCA9IE1hdGguUEk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKEN5bGluZGVyTGlnaHRFZmZlY3QpO1xuXG4gICAgICAgIC8vIOmtlOazlemZo+OCquODluOCuOOCp+OCr+ODiOOCqOODleOCp+OCr+ODiOOAgOOCouODi+ODoeODvOOCt+ODp+ODs1xuICAgICAgICBsZXQgQ3lsTGlnRWZmVHdlZW5JbmZvID0geyB4OiAwLCB5OiAtNSwgejogMCB9O1xuICAgICAgICBsZXQgdXBkYXRlQ3lsTGlnRWZmUG9zaXRpb24gPSAoKSA9PiB7XG4gICAgICAgICAgICBDeWxpbmRlckxpZ2h0RWZmZWN0LnBvc2l0aW9uLnkgPSBDeWxMaWdFZmZUd2VlbkluZm8ueTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBDeWxMaWdFZmZVcFR3ZWVuID0gbmV3IFRXRUVOLlR3ZWVuKEN5bExpZ0VmZlR3ZWVuSW5mbykuZGVsYXkoMTAwMCkudG8oeyB5OiAzIH0sIDE1MDApLmVhc2luZyhUV0VFTi5FYXNpbmcuTGluZWFyLk5vbmUpLm9uVXBkYXRlKHVwZGF0ZUN5bExpZ0VmZlBvc2l0aW9uKTtcbiAgICAgICAgY29uc3QgQ3lsTGlnRWZmVHdlZW5CYWNrID0gbmV3IFRXRUVOLlR3ZWVuKEN5bExpZ0VmZlR3ZWVuSW5mbykuZGVsYXkoOTAwMCkudG8oeyB5OiAtNSB9LCAxMDAwKS5lYXNpbmcoVFdFRU4uRWFzaW5nLlF1YXJ0aWMuT3V0KS5vblVwZGF0ZSh1cGRhdGVDeWxMaWdFZmZQb3NpdGlvbik7XG4gICAgICAgIEN5bExpZ0VmZlVwVHdlZW4uY2hhaW4oQ3lsTGlnRWZmVHdlZW5CYWNrKTtcbiAgICAgICAgQ3lsTGlnRWZmVHdlZW5CYWNrLmNoYWluKEN5bExpZ0VmZlVwVHdlZW4pO1xuICAgICAgICBDeWxMaWdFZmZVcFR3ZWVuLnN0YXJ0KCk7XG4gICAgICAgIC8vIG1hdGVyaWFs44Gu6Imy44GuVHdlZW5cbiAgICAgICAgbmV3IFRXRUVOLlR3ZWVuKEN5bGluZGVyTGlnaHRFZmZlY3RNdGwudW5pZm9ybXMuY29sb3IudmFsdWUpXG4gICAgICAgICAgICAuZGVsYXkoNTAwKVxuICAgICAgICAgICAgLnRvKHsgcjogMSwgZzogMC41LCBiOiAxIH0sIDEwMDApICAgICAgICAgICAvLyDnmb3jgavjg5Xjgqfjg7zjg4lcbiAgICAgICAgICAgIC5lYXNpbmcoVFdFRU4uRWFzaW5nLkxpbmVhci5Ob25lKVxuICAgICAgICAgICAgLnlveW8odHJ1ZSkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmiLvjgovli5XkvZxcbiAgICAgICAgICAgIC5yZXBlYXQoSW5maW5pdHkpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOeEoemZkOODq+ODvOODl1xuICAgICAgICAgICAgLnN0YXJ0KCk7XG5cblxuXG4gICAgICAgIC8vIOmtlOazlemZo+ODkeODvOODhuOCo+OCr+ODq+OCqOODleOCp+OCr+ODiOOAgOODoeODg+OCt+ODpVxuICAgICAgICBsZXQgY3JlYXRlTVNFUGFydGljbGVzID0gKCkgPT4ge1xuICAgICAgICAgICAgLy/jgrjjgqrjg6Hjg4jjg6rjga7kvZzmiJBcbiAgICAgICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XG4gICAgICAgICAgICAvL+ODnuODhuODquOCouODq+OBruS9nOaIkFxuICAgICAgICAgICAgY29uc3QgdGV4dHVyZUxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG4gICAgICAgICAgICBjb25zdCB0ZXh0dXJlID0gdGV4dHVyZUxvYWRlci5sb2FkKCd3aGl0ZXBvaW50LnBuZycpO1xuICAgICAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuUG9pbnRzTWF0ZXJpYWwoeyBzaXplOiAxLjUsIG1hcDogdGV4dHVyZSwgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsIGNvbG9yOiAweGZmNGU0ZSwgZGVwdGhXcml0ZTogZmFsc2UsIHRyYW5zcGFyZW50OiB0cnVlLCBvcGFjaXR5OiAwLjQgfSlcbiAgICAgICAgICAgIC8vcGFydGljbGXjga7kvZzmiJBcbiAgICAgICAgICAgIGNvbnN0IHBhcnRpY2xlTnVtID0gMTUwOyAvLyDjg5Hjg7zjg4bjgqPjgq/jg6vjga7mlbBcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkocGFydGljbGVOdW0gKiAzKTtcbiAgICAgICAgICAgIGxldCBwYXJ0aWNsZUluZGV4ID0gMDtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVWZWxvY2l0eSA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBwYXJ0aWNsZU51bTsgeCsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdCA9IDIgKiBNYXRoLlBJICogTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICBjb25zdCByID0gMTEgKiBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uc1twYXJ0aWNsZUluZGV4KytdID0gciAqIE1hdGguY29zKHQpOyAvLyB45bqn5qiZXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zW3BhcnRpY2xlSW5kZXgrK10gPSAtNDsgLy8geeW6p+aomVxuICAgICAgICAgICAgICAgIHBvc2l0aW9uc1twYXJ0aWNsZUluZGV4KytdID0gciAqIE1hdGguc2luKHQpOyAvLyB65bqn5qiZXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVZlbG9jaXR5LnB1c2gobmV3IFRIUkVFLlZlY3RvcjMoMCwgTWF0aC5yYW5kb20oKSAqIDMgKyAxLCAwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnZW9tZXRyeS5zZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShwb3NpdGlvbnMsIDMpKTtcbiAgICAgICAgICAgIC8vVEhSRUUuUG9pbnRz44Gu5L2c5oiQXG4gICAgICAgICAgICByZXR1cm4gbmV3IFRIUkVFLlBvaW50cyhnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xvdWQyID0gY3JlYXRlTVNFUGFydGljbGVzKCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY2xvdWQyKTtcblxuICAgICAgICAvLyDprZTms5XpmaPjg5Hjg7zjg4bjgqPjgq/jg6vjgqjjg5Xjgqfjgq/jg4jjgIDjgqLjg4vjg6Hjg7zjgrfjg6fjg7NcbiAgICAgICAgbGV0IE1hZ2ljQ2lyY2xlRWZmZWN0R2VvbWV0cnkgPSA8VEhSRUUuQnVmZmVyR2VvbWV0cnk+dGhpcy5jbG91ZDIuZ2VvbWV0cnk7XG4gICAgICAgIGxldCBwb3NpdGlvbnMyID0gTWFnaWNDaXJjbGVFZmZlY3RHZW9tZXRyeS5nZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJyk7XG4gICAgICAgIGNvbnN0IE1hZ2ljQ2lyY2xlRWZmZWN0TWF0ZXJpYWwgPSA8VEhSRUUuUG9pbnRzTWF0ZXJpYWw+dGhpcy5jbG91ZDIubWF0ZXJpYWw7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zaXRpb25zMi5jb3VudDsgKytpKSB7XG4gICAgICAgICAgICBsZXQgdHdlZW5pbmZvMiA9IHsgeDogMCwgeTogLTEsIHo6IDAsIGluZGV4OiBpIH07XG4gICAgICAgICAgICBsZXQgdXBkYXRlUG9pbnRQb3NpdGlvbiA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMyLnNldFkodHdlZW5pbmZvMi5pbmRleCwgdHdlZW5pbmZvMi55KTtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMyLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG9wYWNpdHlJbmZvID0geyBvcGFjaXR5OiBNYWdpY0NpcmNsZUVmZmVjdE1hdGVyaWFsLm9wYWNpdHkgfTtcbiAgICAgICAgICAgIGxldCB1cGRhdGVQb2ludE9wYWNpdHkgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgTWFnaWNDaXJjbGVFZmZlY3RNYXRlcmlhbC5vcGFjaXR5ID0gb3BhY2l0eUluZm8ub3BhY2l0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG1zZVR3ZWVuID0gbmV3IFRXRUVOLlR3ZWVuKHR3ZWVuaW5mbzIpLnRvKHsgeTogMTUgfSwgMCkub25VcGRhdGUodXBkYXRlUG9pbnRQb3NpdGlvbik7XG4gICAgICAgICAgICBjb25zdCBtc2VNYXRlcmlhbFR3ZWVuID0gbmV3IFRXRUVOLlR3ZWVuKG9wYWNpdHlJbmZvKS5kZWxheSg5NTAwKS50byh7IG9wYWNpdHk6IDAgfSwgMzAwMCkub25VcGRhdGUodXBkYXRlUG9pbnRPcGFjaXR5KTtcbiAgICAgICAgICAgIGNvbnN0IG1zZU1hdGVyaWFsVHdlZW5CYWNrID0gbmV3IFRXRUVOLlR3ZWVuKG9wYWNpdHlJbmZvKS50byh7IG9wYWNpdHk6IDAuNCB9LCAwKS5vblVwZGF0ZSh1cGRhdGVQb2ludE9wYWNpdHkpO1xuICAgICAgICAgICAgbXNlTWF0ZXJpYWxUd2Vlbi5jaGFpbihtc2VUd2Vlbik7XG4gICAgICAgICAgICBtc2VUd2Vlbi5jaGFpbihtc2VNYXRlcmlhbFR3ZWVuQmFjayk7XG4gICAgICAgICAgICBtc2VNYXRlcmlhbFR3ZWVuQmFjay5jaGFpbihtc2VNYXRlcmlhbFR3ZWVuKTtcbiAgICAgICAgICAgIG1zZU1hdGVyaWFsVHdlZW4uc3RhcnQoKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8g5Y+s5Zaa54mp44Oh44OD44K344OlXG4gICAgICAgIGxldCBTY2FybGV0OiBUSFJFRS5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHsgY29sb3I6IDB4QkEyNjM2IH0pO1xuICAgICAgICBsZXQgQmxhY2s6IFRIUkVFLk1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyBjb2xvcjogMHgyQjJCMkIgfSk7XG4gICAgICAgIGxldCBHb2xkOiBUSFJFRS5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHsgY29sb3I6IDB4RkZENzAwIH0pO1xuICAgICAgICBsZXQgY3JlYXRlR2F0ZSA9IChjb2xvcjogVEhSRUUuTWF0ZXJpYWwpID0+IHtcbiAgICAgICAgICAgIGxldCB0ZW1wR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICAgICAgICAgIC8v5p+xXG4gICAgICAgICAgICBsZXQgQ3lsaW5kZXJHZW9tZXRyeTogVEhSRUUuQnVmZmVyR2VvbWV0cnkgPSBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeSgwLjUsIDAuNSwgOCwgMzIpO1xuICAgICAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gLTE7IGkgPCAyOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICBsZXQgQ3lsaW5kZXJBZGQ6IFRIUkVFLk1lc2ggPSBuZXcgVEhSRUUuTWVzaChDeWxpbmRlckdlb21ldHJ5LCBjb2xvcik7XG4gICAgICAgICAgICAgICAgQ3lsaW5kZXJBZGQucG9zaXRpb24ueiA9IDMgKiBpO1xuICAgICAgICAgICAgICAgIEN5bGluZGVyQWRkLnBvc2l0aW9uLnkgPSAxMTtcbiAgICAgICAgICAgICAgICB0ZW1wR3JvdXAuYWRkKEN5bGluZGVyQWRkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v5Y+w6LyqXG4gICAgICAgICAgICBsZXQgQ3lsaW5kZXJHZW9tZXRyeTI6IFRIUkVFLkJ1ZmZlckdlb21ldHJ5ID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMC43LCAwLjcsIDAuMywgMzIpO1xuICAgICAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gLTE7IGkgPCAyOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICBsZXQgQ3lsaW5kZXJBZGQ6IFRIUkVFLk1lc2ggPSBuZXcgVEhSRUUuTWVzaChDeWxpbmRlckdlb21ldHJ5MiwgY29sb3IpO1xuICAgICAgICAgICAgICAgIEN5bGluZGVyQWRkLnBvc2l0aW9uLnogPSAzICogaTtcbiAgICAgICAgICAgICAgICBDeWxpbmRlckFkZC5wb3NpdGlvbi55ID0gMTU7XG4gICAgICAgICAgICAgICAgdGVtcEdyb3VwLmFkZChDeWxpbmRlckFkZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL+iyq1xuICAgICAgICAgICAgbGV0IEJveEdlb21ldHJ5OiBUSFJFRS5CdWZmZXJHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgxMSwgMC41LCAwLjUsIDMyKTtcbiAgICAgICAgICAgIGxldCBCb3hBZGQ6IFRIUkVFLk1lc2ggPSBuZXcgVEhSRUUuTWVzaChCb3hHZW9tZXRyeSwgY29sb3IpO1xuICAgICAgICAgICAgQm94QWRkLnBvc2l0aW9uLnkgPSAxMy41O1xuICAgICAgICAgICAgQm94QWRkLnJvdGF0aW9uLnkgPSBUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoOTApO1xuICAgICAgICAgICAgdGVtcEdyb3VwLmFkZChCb3hBZGQpO1xuICAgICAgICAgICAgLy/ls7bmnKhcbiAgICAgICAgICAgIGxldCBCb3hHZW9tZXRyeTI6IFRIUkVFLkJ1ZmZlckdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDEyLCAwLjUsIDEsIDMyKTtcbiAgICAgICAgICAgIGxldCBCb3hBZGQyOiBUSFJFRS5NZXNoID0gbmV3IFRIUkVFLk1lc2goQm94R2VvbWV0cnkyLCBjb2xvcik7XG4gICAgICAgICAgICBCb3hBZGQyLnBvc2l0aW9uLnkgPSAxNS40O1xuICAgICAgICAgICAgQm94QWRkMi5yb3RhdGlvbi55ID0gVEhSRUUuTWF0aFV0aWxzLmRlZ1RvUmFkKDkwKTtcbiAgICAgICAgICAgIHRlbXBHcm91cC5hZGQoQm94QWRkMik7XG4gICAgICAgICAgICAvL+esoOacqFxuICAgICAgICAgICAgbGV0IEJveEdlb21ldHJ5MzogVEhSRUUuQnVmZmVyR2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoMTMsIDAuNSwgMS41LCAzMik7XG4gICAgICAgICAgICBsZXQgQm94QWRkMzogVEhSRUUuTWVzaCA9IG5ldyBUSFJFRS5NZXNoKEJveEdlb21ldHJ5MywgQmxhY2spO1xuICAgICAgICAgICAgQm94QWRkMy5wb3NpdGlvbi55ID0gMTUuOTtcbiAgICAgICAgICAgIEJveEFkZDMucm90YXRpb24ueSA9IFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZCg5MCk7XG4gICAgICAgICAgICB0ZW1wR3JvdXAuYWRkKEJveEFkZDMpO1xuICAgICAgICAgICAgLy/olqzluqdcbiAgICAgICAgICAgIGxldCBDb25lR2VvbWV0cnk6IFRIUkVFLkJ1ZmZlckdlb21ldHJ5ID0gbmV3IFRIUkVFLkNvbmVHZW9tZXRyeSgwLjcsIDAuNywgMzIpO1xuICAgICAgICAgICAgbGV0IEN5bGluZGVyR2VvbWV0cnkzOiBUSFJFRS5CdWZmZXJHZW9tZXRyeSA9IG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KDAuNywgMC43LCAxLjUsIDMyKTtcbiAgICAgICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IC0xOyBpIDwgMjsgaSArPSAyKSB7XG4gICAgICAgICAgICAgICAgbGV0IENvbmVBZGQ6IFRIUkVFLk1lc2ggPSBuZXcgVEhSRUUuTWVzaChDb25lR2VvbWV0cnksIEJsYWNrKTtcbiAgICAgICAgICAgICAgICBDb25lQWRkLnBvc2l0aW9uLnogPSAzICogaTtcbiAgICAgICAgICAgICAgICBDb25lQWRkLnBvc2l0aW9uLnkgPSA4Ljg7XG4gICAgICAgICAgICAgICAgdGVtcEdyb3VwLmFkZChDb25lQWRkKTtcbiAgICAgICAgICAgICAgICBsZXQgQ3lsaW5kZXJBZGQzOiBUSFJFRS5NZXNoID0gbmV3IFRIUkVFLk1lc2goQ3lsaW5kZXJHZW9tZXRyeTMsIEJsYWNrKTtcbiAgICAgICAgICAgICAgICBDeWxpbmRlckFkZDMucG9zaXRpb24ueiA9IDMgKiBpO1xuICAgICAgICAgICAgICAgIEN5bGluZGVyQWRkMy5wb3NpdGlvbi55ID0gNy43O1xuICAgICAgICAgICAgICAgIHRlbXBHcm91cC5hZGQoQ3lsaW5kZXJBZGQzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0ZW1wR3JvdXA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ncm91cCA9IGNyZWF0ZUdhdGUoR29sZCk7XG5cbiAgICAgICAgdGhpcy5ncm91cC5wb3NpdGlvbi55ID0gLTE5O1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmdyb3VwKTtcblxuXG4gICAgICAgIC8vIOWPrOWWmueJqeOCouODi+ODoeODvOOCt+ODp+ODs1xuICAgICAgICBsZXQgYm94VHdlZW5JbmZvID0geyB4OiAwLCB5OiAtMTcsIHo6IDAgfTtcbiAgICAgICAgbGV0IHVwZGF0ZUJveFBvc2l0aW9uID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5ncm91cC5wb3NpdGlvbi55ID0gYm94VHdlZW5JbmZvLnk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYm94VXBUd2VlbiA9IG5ldyBUV0VFTi5Ud2Vlbihib3hUd2VlbkluZm8pLmRlbGF5KDU1MDApLnRvKHsgeTogLTUgfSwgMjAwMCkuZWFzaW5nKFRXRUVOLkVhc2luZy5RdWFkcmF0aWMuSW5PdXQpLm9uVXBkYXRlKHVwZGF0ZUJveFBvc2l0aW9uKTtcbiAgICAgICAgY29uc3QgYm94VHdlZW4xID0gbmV3IFRXRUVOLlR3ZWVuKGJveFR3ZWVuSW5mbykuZGVsYXkoMzAwMCkudG8oeyB5OiAtNyB9LCAyMDApLmVhc2luZyhUV0VFTi5FYXNpbmcuQ2lyY3VsYXIuT3V0KS5vblVwZGF0ZSh1cGRhdGVCb3hQb3NpdGlvbik7XG4gICAgICAgIGNvbnN0IGJveFR3ZWVuMiA9IG5ldyBUV0VFTi5Ud2Vlbihib3hUd2VlbkluZm8pLnRvKHsgeTogMTIgfSwgODAwKS5lYXNpbmcoVFdFRU4uRWFzaW5nLkxpbmVhci5Ob25lKS5vblVwZGF0ZSh1cGRhdGVCb3hQb3NpdGlvbik7XG4gICAgICAgIGNvbnN0IGJveFR3ZWVuMyA9IG5ldyBUV0VFTi5Ud2Vlbihib3hUd2VlbkluZm8pLnRvKHsgeTogLTE5IH0sIDEwMDApLmVhc2luZyhUV0VFTi5FYXNpbmcuRXhwb25lbnRpYWwuT3V0KS5vblVwZGF0ZSh1cGRhdGVCb3hQb3NpdGlvbik7XG4gICAgICAgIGJveFVwVHdlZW4uY2hhaW4oYm94VHdlZW4xKTtcbiAgICAgICAgYm94VHdlZW4xLmNoYWluKGJveFR3ZWVuMik7XG4gICAgICAgIGJveFR3ZWVuMi5jaGFpbihib3hUd2VlbjMpO1xuICAgICAgICBib3hUd2VlbjMuY2hhaW4oYm94VXBUd2Vlbik7XG4gICAgICAgIGJveFVwVHdlZW4uc3RhcnQoKTtcblxuXG4gICAgICAgIC8vIOijhemjvu+8iOmzpeWxhe+8iVxuICAgICAgICBsZXQgZ3JvdXAyczogVEhSRUUuR3JvdXBbXSA9IFtdO1xuICAgICAgICBsZXQgdGhldGFzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE1OyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuZ3JvdXAyID0gY3JlYXRlR2F0ZShTY2FybGV0KTtcbiAgICAgICAgICAgIGxldCB0aGV0YSA9IDIgKiBNYXRoLlBJICogaSAvIDE1O1xuICAgICAgICAgICAgdGhpcy5ncm91cDIucG9zaXRpb24ueCA9IDI1ICogTWF0aC5zaW4odGhldGEpO1xuICAgICAgICAgICAgdGhpcy5ncm91cDIucG9zaXRpb24ueSA9IC0xMCAtIDUgKiBNYXRoLnNpbih0aGV0YSk7XG4gICAgICAgICAgICB0aGlzLmdyb3VwMi5yb3RhdGlvbi55ID0gdGhldGE7XG4gICAgICAgICAgICB0aGlzLmdyb3VwMi5wb3NpdGlvbi56ID0gMjUgKiBNYXRoLmNvcyh0aGV0YSk7XG4gICAgICAgICAgICBncm91cDJzLnB1c2godGhpcy5ncm91cDIpO1xuICAgICAgICAgICAgdGhldGFzLnB1c2godGhldGEpO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5ncm91cDIpO1xuICAgICAgICB9XG5cblxuICAgICAgICAvLyDoo4Xpo77vvIjmraPlhavpnaLkvZPvvIlcbiAgICAgICAgbGV0IGFkZFJhbmRvbVJpbmcgPSAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgUmluZ0dlb21ldHJ5OiBUSFJFRS5PY3RhaGVkcm9uR2VvbWV0cnkgPSBuZXcgVEhSRUUuT2N0YWhlZHJvbkdlb21ldHJ5KDIpO1xuICAgICAgICAgICAgbGV0IFJpbmdNYXRlcmlhbDogVEhSRUUuTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IGNvbG9yOiBuZXcgVEhSRUUuQ29sb3IoTWF0aC5yYW5kb20oKSAqIDAuNSArIDAuNSwgMCwgTWF0aC5yYW5kb20oKSkgfSk7XG4gICAgICAgICAgICBsZXQgUmluZ0FkZDogVEhSRUUuTWVzaCA9IG5ldyBUSFJFRS5NZXNoKFJpbmdHZW9tZXRyeSwgUmluZ01hdGVyaWFsKTtcbiAgICAgICAgICAgIGxldCByID0gMTAwICsgMTAwICogTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIGxldCBVID0gTWF0aC5QSSAqIDIgKiBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgbGV0IFYgPSBNYXRoLlBJICogMiAqIE1hdGgucmFuZG9tKCkgLSBNYXRoLlBJO1xuICAgICAgICAgICAgUmluZ0FkZC5wb3NpdGlvbi54ID0gciAqIE1hdGguY29zKFUpICogTWF0aC5jb3MoVik7XG4gICAgICAgICAgICBSaW5nQWRkLnBvc2l0aW9uLnkgPSByICogTWF0aC5zaW4oVSkgKiBNYXRoLmNvcyhWKTtcbiAgICAgICAgICAgIFJpbmdBZGQucG9zaXRpb24ueiA9IHIgKiBNYXRoLnNpbihWKTtcbiAgICAgICAgICAgIFJpbmdBZGQucm90YXRpb24ueSA9IFRIUkVFLk1hdGhVdGlscy5kZWdUb1JhZChNYXRoLnJhbmRvbSgpICogMzYwKTtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKFJpbmdBZGQpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCAxMDAwOyBpKyspIHtcbiAgICAgICAgICAgIGFkZFJhbmRvbVJpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOWPrOWWmueJqeWGheODl+ODrOODvOODiOODhuOCr+OCueODgeODo1xuICAgICAgICBjb25zdCBwbGFuZUdlb20gPSBuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSg1LCA2LjcpO1xuICAgICAgICBjb25zdCBsb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuICAgICAgICBjb25zdCB0ZXh0dXJlID0gbG9hZGVyLmxvYWQoJ2dhdGUyLmpwZWcnKTtcbiAgICAgICAgY29uc3QgcGxhbmVNdGwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRleHR1cmUgfSk7XG4gICAgICAgIGNvbnN0IHBsYW5lID0gbmV3IFRIUkVFLk1lc2gocGxhbmVHZW9tLCBwbGFuZU10bCk7XG4gICAgICAgIHBsYW5lLnBvc2l0aW9uLnkgPSAxMC4zO1xuICAgICAgICBwbGFuZS5yb3RhdGlvbi55ID0gTWF0aC5QSSAvIDI7XG4gICAgICAgIHRoaXMuZ3JvdXAuYWRkKHBsYW5lKTtcblxuXG5cblxuXG4gICAgICAgIC8v44Op44Kk44OI44Gu6Kit5a6aXG4gICAgICAgIHRoaXMubGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZik7XG4gICAgICAgIGNvbnN0IGx2ZWMgPSBuZXcgVEhSRUUuVmVjdG9yMygxLCAxLCAxKS5ub3JtYWxpemUoKTtcbiAgICAgICAgdGhpcy5saWdodC5wb3NpdGlvbi5zZXQobHZlYy54LCBsdmVjLnksIGx2ZWMueik7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMubGlnaHQpO1xuXG4gICAgICAgIC8vIOavjuODleODrOODvOODoOOBrnVwZGF0ZeOCkuWRvOOCk+OBp++8jOabtOaWsFxuICAgICAgICAvLyByZXFlc3RBbmltYXRpb25GcmFtZSDjgavjgojjgormrKHjg5Xjg6zjg7zjg6DjgpLlkbzjgbZcbiAgICAgICAgbGV0IHQgPSAwO1xuICAgICAgICBsZXQgZCA9IDA7XG4gICAgICAgIGxldCBkMiA9IDA7XG4gICAgICAgIGNvbnN0IGNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG4gICAgICAgIGxldCB1cGRhdGU6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhVGltZSA9IGNsb2NrLmdldERlbHRhKCk7XG4gICAgICAgICAgICB0ID0gTWF0aC5QSSAvIDIuNSAqIGRlbHRhVGltZTtcblxuICAgICAgICAgICAgVFdFRU4udXBkYXRlKHRpbWUpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc2l0aW9ucy5jb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPj0gMTgyMilcbiAgICAgICAgICAgICAgICAgICAgdCA9IC1NYXRoLlBJIC8gMi41ICogZGVsdGFUaW1lO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5zZXRYKGksIHBvc2l0aW9ucy5nZXRYKGkpICogTWF0aC5jb3ModCkgLSBwb3NpdGlvbnMuZ2V0WihpKSAqIE1hdGguc2luKHQpKTtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMuc2V0WShpLCBwb3NpdGlvbnMuZ2V0WShpKSk7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25zLnNldFooaSwgcG9zaXRpb25zLmdldFooaSkgKiBNYXRoLmNvcyh0KSArIHBvc2l0aW9ucy5nZXRYKGkpICogTWF0aC5zaW4odCkpO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZ2VvbSA9IDxUSFJFRS5CdWZmZXJHZW9tZXRyeT50aGlzLmNsb3VkMi5nZW9tZXRyeTtcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IGdlb20uZ2V0QXR0cmlidXRlKCdwb3NpdGlvbicpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3MuY291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHBvcy5zZXRZKGksIHBvcy5nZXRZKGkpICsgdGhpcy5wYXJ0aWNsZVZlbG9jaXR5W2ldLnkgKiBkZWx0YVRpbWUpO1xuICAgICAgICAgICAgICAgIGlmIChwb3MuZ2V0WShpKSA+PSAxNCkge1xuICAgICAgICAgICAgICAgICAgICBwb3Muc2V0WShpLCAtNCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9zLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblxuICAgICAgICAgICAgY29uc3QgcGdlb20gPSA8VEhSRUUuQnVmZmVyR2VvbWV0cnk+cGxhbmUuZ2VvbWV0cnk7XG4gICAgICAgICAgICBkICs9IHQgKiAzO1xuICAgICAgICAgICAgaWYgKGQgPiBNYXRoLlBJICogMilcbiAgICAgICAgICAgICAgICBkID0gMDtcbiAgICAgICAgICAgIGNvbnN0IHIgPSAwLjggKyBNYXRoLnNpbihNYXRoLlBJICsgZCkgLyAxMDtcbiAgICAgICAgICAgIGNvbnN0IHV2cyA9IG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgICAgICAgICAgICAgIHIgKiBNYXRoLmNvcyhNYXRoLlBJICogNSAvIDQgKyBkKSAqIE1hdGguc3FydCgyKSAqIDAuNSArIDAuNSwgciAqIE1hdGguc2luKE1hdGguUEkgKiA1IC8gNCArIGQpICogTWF0aC5zcXJ0KDIpICogMC41ICsgMC41LFxuICAgICAgICAgICAgICAgIHIgKiBNYXRoLmNvcyhNYXRoLlBJICogNyAvIDQgKyBkKSAqIE1hdGguc3FydCgyKSAqIDAuNSArIDAuNSwgciAqIE1hdGguc2luKE1hdGguUEkgKiA3IC8gNCArIGQpICogTWF0aC5zcXJ0KDIpICogMC41ICsgMC41LFxuICAgICAgICAgICAgICAgIHIgKiBNYXRoLmNvcyhNYXRoLlBJICogMyAvIDQgKyBkKSAqIE1hdGguc3FydCgyKSAqIDAuNSArIDAuNSwgciAqIE1hdGguc2luKE1hdGguUEkgKiAzIC8gNCArIGQpICogTWF0aC5zcXJ0KDIpICogMC41ICsgMC41LFxuICAgICAgICAgICAgICAgIHIgKiBNYXRoLmNvcyhNYXRoLlBJIC8gNCArIGQpICogTWF0aC5zcXJ0KDIpICogMC41ICsgMC41LCByICogTWF0aC5zaW4oTWF0aC5QSSAvIDQgKyBkKSAqIE1hdGguc3FydCgyKSAqIDAuNSArIDAuNSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgcGdlb20uc2V0QXR0cmlidXRlKCd1dicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUodXZzLCAyKSk7XG5cbiAgICAgICAgICAgIGQyICs9IHQ7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3VwMnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBncm91cDJzW2ldLnBvc2l0aW9uLnkgPSAtMTYgLSAyICogTWF0aC5zaW4odGhldGFzW2ldK2QyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG4gICAgfVxuXG5cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQpO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGxldCBjb250YWluZXIgPSBuZXcgVGhyZWVKU0NvbnRhaW5lcigpO1xuXG4gICAgbGV0IHZpZXdwb3J0ID0gY29udGFpbmVyLmNyZWF0ZVJlbmRlcmVyRE9NKDY0MCwgNDgwLCBuZXcgVEhSRUUuVmVjdG9yMygxOCwgMTAsIDMwKSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2aWV3cG9ydCk7XG59XG5cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfdHdlZW5qc190d2Vlbl9qc19kaXN0X3R3ZWVuX2VzbV9qcy1ub2RlX21vZHVsZXNfdGhyZWVfZXhhbXBsZXNfanNtX2NvbnRyLTc4ZDM5MlwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==