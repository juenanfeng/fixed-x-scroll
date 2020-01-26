//自定义滚动条
import PerfectScrollbar from 'perfect-scrollbar';
//对应的css
import "perfect-scrollbar/css/perfect-scrollbar.css";


const updateScrollBar = (el) => {
    const railX = el.querySelector(".ps__rail-x");
    const _tbody = el;
    //如果table内部还有滚动条的话需要加上_tbody.scrollTop
    const _top = window.innerHeight - _tbody.getBoundingClientRect().top  - railX.clientHeight;
    railX.style.top = `${_top}px`;
    railX.style.opacity = "1";
    railX.style.display = "block";
}

const el_scrollBar = (el) => {
    if (el._ps_ instanceof PerfectScrollbar) {
        el._ps_.update();
    } else {
        el._ps_ = new PerfectScrollbar(el, {
            suppressScrollX: false,
            suppressScrollY: true //y方向禁止
        });
        // setTimeout(() => {
        //     el._ps_.update();
        // }, 17);
    }
};

let isScrolling = false;
let _scrollHander = null;
let _resizeHander = null;

const directive = {
    inserted(el) {
        el = el.querySelector(".el-table__body-wrapper");
        if (!el) {
            return console.warn("未发现className为el-table__body-wrapper的dom");
        }
        const rules = ["fixed", "absolute", "relative"];
        if (!rules.includes(window.getComputedStyle(el, null).position)) {
            console.error(`perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join("、")}`)
        }
        el_scrollBar(el);
        updateScrollBar(el);

        //注册scroll和resize事件
        _scrollHander = () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    updateScrollBar(el);
                    isScrolling = false;
                });
            }
            isScrolling = true;
        };

        _resizeHander = () => {
            updateScrollBar(el)
        }

        document.addEventListener("scroll", _scrollHander)
        window.addEventListener("resize", _resizeHander)
    },
    componentUpdated(el, binding, vnode) {
        const {
            expression
        } = binding;

        el = el.querySelector(".el-table__body-wrapper");
        if (!el) {
            return console.warn("未发现className为el-table__body-wrapper的dom");
        }

        const handler = () => vnode.context[expression].apply();

        vnode.context.$nextTick(
            () => {
                try {
                    el_scrollBar(el);
                    updateScrollBar(el);
                    if (expression) {
                        handler()
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        )
    },
    unbind() {
        document.removeEventListener("scroll", _scrollHander)
        window.removeEventListener("resize", _resizeHander)
    }
}

export default directive;