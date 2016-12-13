let _ = require("lodash");


const $RUNNING = "RUNNING";
const $FAILURE = "FAILURE";
const $SUCCESS = "SUCCESS";

exports.$RUNNING = $RUNNING;
exports.$FAILURE = $FAILURE;
exports.$SUCCESS = $SUCCESS;

exports.debug = false;


function run(actor, memory, tree, node, level) {
	let c_node = node || tree;
	let c_level = level || 1;
	let indent = Array(c_level).join(" ");
  let log = null;
  if (exports.debug)
	  log = (msg) => 	console.log(`${indent}[${c_level}]${msg}`);
  else
   log = function () {};
	let name = _.get(c_node,"$des","UNNAMED");
	//log(`run: etree:${JSON.stringify(c_node)}`)
	if (c_node == undefined) {
		log("end node");
		return $SUCCESS;
	}  else if ( _.isFunction(c_node)) {
		let ret = c_node(actor, memory);
		log (`@ACTION(UNNAMED): ${ret}`);
		return ret;
	} else if ( _.isObject(c_node)) {
		if (c_node.$node) {
			let ret = $FAILURE;
			log (`@NODE(${name}): started`);
			ret = run(actor, memory, tree, c_node.$node, c_level + 1);
			log (`@NODE(${name}): ${ret}`);
			return ret;
		} else if (c_node.$sel) {
			let ret = $FAILURE;
			log (`@SEL(${name}) started`);
			for (let i in c_node.$sel) {
				ret = run(actor, memory, tree, c_node.$sel[i], c_level + 1);
				if (ret  == $SUCCESS || ret == $RUNNING) break;
			}
			log (`@SEL(${name}) Ended: ${ret}`);
			return ret;
		} else if ( c_node.$seq) {
			let ret = $FAILURE;
			log (`@SEQ(${name}) started`);
			for (let i in c_node.$seq) {
				ret = run (actor, memory, tree, c_node.$seq[i], c_level + 1 );
				if (ret  == $FAILURE || ret == $RUNNING) break;
			}
			log (`@SEQ(${name}) ended:${ret}`);
			return ret;
		} else if ( c_node.$if) {
			let ret = $FAILURE;
			log (`@IF-THEN-ELSE(${name}) started`);
			ret = run (actor, memory, tree, c_node.$if, c_level + 1 );
			if (ret == $SUCCESS) {
				log (`@THEN(${name}):`);
				ret = run (actor, memory, tree, c_node.$then, c_level + 1 );
			} else if ( ret == $FAILURE && c_node.$else) {
				log (`@ELSE(${name}):`);
				ret = run (actor, memory, tree, c_node.$else, c_level + 1 );
			}
			log (`@IF-THEN-ELSE(${name}) ended:${ret}`);
			return ret;
		} else if ( c_node.$inv) {
			let ret = $FAILURE;
			log (`@INVERT(${name}) started`);
      ret  = run (actor, memory, tree, c_node.$inv, c_level + 1 );
      let ret1 = ret;
			if (ret  == $FAILURE )
				ret = $SUCCESS;
			else if (ret == $SUCCESS)
				ret = $FAILURE;
			log (`@INVERT(${name}) ended:${ret1}->${ret}`);
			return ret;
		} else {
			log (`unknonw`);
		}
	} else if (_.isString(c_node)) {
		if ([$SUCCESS, $FAILURE, $RUNNING].includes(c_node)) {
			log (`@CONST(${c_node})`);
			return c_node;
		} else {
			let func = _.get(tree.$act, c_node, () => $FAILURE);
			let ret = func(actor, memory);
			log (`@ACTION(${c_node}): ${ret}`);
			return ret;
		}
	} else {
		log(`unchandled Node ${typeof (c_node)}`);
	}
}

exports.runBt = run;
