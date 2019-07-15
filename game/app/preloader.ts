function element(tag: string, attributes: any, children: any[] = []) {
	const el = document.createElement(tag);

	Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));

	children.forEach((child) => {
		if (typeof child === 'string') {
			el.appendChild(document.createTextNode(child));
		} else {
			el.appendChild(child);
		}
	});

	return el;
}

function PreloadComponent({ loaded = 0, total = 0 } = {}) {
	return element('div', { class: 'preload' }, [
		element('div', { class: 'content' }, [
			element('h1', {}, ['Collecting tools']),
			element('h2', {}, ['Please wait while application is loading']),
			total > 0 ? element('h3', {}, [`${loaded} / ${total}`]) : null,
		].filter(Boolean)),
	]);
}

export default PreloadComponent;
