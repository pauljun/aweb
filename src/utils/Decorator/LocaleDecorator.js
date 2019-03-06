// 国际化调试
import intl from 'react-intl-universal';

function _lan(str,options = {}) {
	let storage = localStorage.getItem('currentLocale');
	storage = storage?JSON.parse(storage):'zh-CN';
	const currentLocale = options.Locale?options.Locale:storage;
	if(currentLocale === 'zh-CN'){
		return intl.get('CHINESE',{value:str})
	} else {
		return intl.get(`CHINESE.${str}`).d(str)
	}
}

function LocaleDecorator(component) {
  component.prototype.lan = _lan;
  return component;
}
export default LocaleDecorator;