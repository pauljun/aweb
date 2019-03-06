import React from 'react';
import 'src/libs/ThreeJS/index.js';

const SEPARATION = 100,
	AMOUNTX = 100,
	AMOUNTY = 70;

export default class AnimateBox extends React.Component {
	constructor(props) {
		super(props);
		this.container = document.createElement('div');
		this.refDom = React.createRef();
		this.camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 1000;
		this.scene = new THREE.Scene();
		this.particles = [];
		this.particle = undefined;
		this.count = 0;
		this.renderer = new THREE.CanvasRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.container.appendChild(this.renderer.domElement);
		this.windowHalfX = window.innerWidth / 2;
		this.windowHalfY = window.innerHeight / 2;
		this.mouseX = 85;
		this.mouseY = -342;
		this.animateFrame = null;
		this.initScene();
	}
	componentDidMount() {
		this.refDom.current.appendChild(this.container);
		this.animate();
		document.addEventListener('mousemove', this.onDocumentMouseMove, false);
		document.addEventListener('touchstart', this.onDocumentTouchStart, false);
		document.addEventListener('touchmove', this.onDocumentTouchMove, false);
		window.addEventListener('resize', this.onWindowResize, false);
	}
	componentWillUnmount() {
		document.removeEventListener('mousemove', this.onDocumentMouseMove, false);
		document.removeEventListener('touchstart', this.onDocumentTouchStart, false);
		document.removeEventListener('touchmove', this.onDocumentTouchMove, false);
		window.removeEventListener('resize', this.onWindowResize, false);
		cancelAnimationFrame(this.animateFrame);
		this.container.removeChild(this.renderer.domElement);
		this.refDom.current.removeChild(this.container);
		this.container = null;
		this.refDom = null;
		this.camera = null;
		this.scene = null;
		this.particles = null;
		this.particle = null;
		this.count = null;
		this.renderer = null;
		this.windowHalfX = null;
		this.windowHalfY = null;
		this.mouseX = null;
		this.mouseY = null;
		this.animateFrame = null;
	}
	animate = () => {
		this.animateFrame = requestAnimationFrame(this.animate);
		this.renderAnimate();
	};
	initScene() {
		const PI2 = Math.PI * 2;
		const material = new THREE.ParticleCanvasMaterial({
			color: 0xffffff,
			program: function(context) {
				context.beginPath();
				context.arc(0, 0, 0.6, 0, PI2, true);
				context.fill();
			}
		});

		let i = 0;

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				this.particle = this.particles[i++] = new THREE.Particle(material);
				this.particle.position.x = ix * SEPARATION - AMOUNTX * SEPARATION / 2;
				this.particle.position.z = iy * SEPARATION - AMOUNTY * SEPARATION / 2;
				this.scene.add(this.particle);
			}
		}
	}
	renderAnimate() {
		this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
		this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
		this.camera.lookAt(this.scene.position);

		var i = 0;

		for (var ix = 0; ix < AMOUNTX; ix++) {
			for (var iy = 0; iy < AMOUNTY; iy++) {
				this.particle = this.particles[i++];
				this.particle.position.y = Math.sin((ix + this.count) * 0.3) * 50 + Math.sin((iy + this.count) * 0.5) * 50;
				this.particle.scale.x = this.particle.scale.y =
					(Math.sin((ix + this.count) * 0.3) + 1) * 2 + (Math.sin((iy + this.count) * 0.5) + 1) * 2;
			}
		}

		this.renderer.render(this.scene, this.camera);

		this.count += 0.1;
	}
	onWindowResize = () => {
		this.windowHalfX = window.innerWidth / 2;
		this.windowHalfY = window.innerHeight / 2;
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	};

	//

	onDocumentMouseMove = (event) => {
		this.mouseX = event.clientX - this.windowHalfX;
		this.mouseY = event.clientY - this.windowHalfY;
	};

	onDocumentTouchStart = (event) => {
		if (event.touches.length === 1) {
			event.preventDefault();
			this.mouseX = event.touches[0].pageX - this.windowHalfX;
			this.mouseY = event.touches[0].pageY - this.windowHalfY;
		}
	};

	onDocumentTouchMove = (event) => {
		if (event.touches.length === 1) {
			event.preventDefault();

			this.mouseX = event.touches[0].pageX - this.windowHalfX;
			this.mouseY = event.touches[0].pageY - this.windowHalfY;
		}
	};
	render() {
		return <div className="animate-box" ref={this.refDom} />;
	}
}
