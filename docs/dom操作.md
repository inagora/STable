* 样式、属性尽量使用vue来操作，特殊情况下使用下面的style和class来直接操作
* style 操作
	* 通过el.style.width = '10px'这样的可以；
	* 也可以直接el.style.cssText，多个属性一起修改时，cssText会很方便
* class操作
	* 没有jquery，请使用el.classList的相关方法操作
		* has
		* add
		* remove
* ajax
	* 目前ajax使用的XMLHttpRequest自己写的，希望用fetch简化
* dom元的添加、删除，appendChild、remove
