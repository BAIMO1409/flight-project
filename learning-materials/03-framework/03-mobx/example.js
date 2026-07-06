// ============================================
// MobX 示例程序
// 涵盖核心知识点：Observable、Computed、Action、Reaction、MobX-React集成
// ============================================

const { makeAutoObservable, observable, computed, action, runInAction, autorun, reaction, when } = require('mobx');

// ============================================
// 1. 基础用法 - makeAutoObservable
// ============================================
console.log('=== 1. makeAutoObservable ===');

class FlightStore {
    // Observable: 可观察状态
    flights = [];
    selectedDate = '';
    sortType = 'recommend';
    isLoading = false;

    constructor() {
        // 自动使类成员可观察
        makeAutoObservable(this);
    }

    // Action: 修改状态的动作
    setSelectedDate(date) {
        this.selectedDate = date;
    }

    setSortType(sort) {
        this.sortType = sort;
    }

    addFlight(flight) {
        this.flights.push(flight);
    }

    removeFlight(id) {
        this.flights = this.flights.filter(f => f.id !== id);
    }

    toggleFavorite(id) {
        const flight = this.flights.find(f => f.id === id);
        if (flight) {
            flight.favorite = !flight.favorite;
        }
    }

    // 异步Action
    async loadFlights(date, sort) {
        this.isLoading = true;
        
        try {
            // 模拟异步请求
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const flights = [
                { id: 1, flightNo: 'CA1234', airline: '国航', price: 500, favorite: false },
                { id: 2, flightNo: 'MU5678', airline: '东航', price: 550, favorite: false },
                { id: 3, flightNo: 'CZ9012', airline: '南航', price: 480, favorite: false }
            ];
            
            // 异步操作中更新状态需要使用runInAction
            runInAction(() => {
                this.flights = flights;
                this.selectedDate = date;
                this.sortType = sort;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.isLoading = false;
            });
            throw error;
        }
    }

    // Computed: 计算属性（自动追踪依赖）
    get sortedFlights() {
        const sorted = [...this.flights];
        switch (this.sortType) {
            case 'price':
                return sorted.sort((a, b) => a.price - b.price);
            case 'time':
                return sorted.sort((a, b) => a.flightNo.localeCompare(b.flightNo));
            case 'recommend':
            default:
                return sorted.sort((a, b) => a.price - b.price);
        }
    }

    get favoriteFlights() {
        return this.flights.filter(f => f.favorite);
    }

    get totalPrice() {
        return this.flights.reduce((sum, f) => sum + f.price, 0);
    }
}

// 创建Store实例
const store = new FlightStore();

// ============================================
// 2. Reaction（响应状态变化）
// ============================================
console.log('\n=== 2. Reaction ===');

// autorun: 自动运行，追踪所有依赖
const disposer1 = autorun(() => {
    console.log('autorun: flights count =', store.flights.length);
});

// reaction: 条件响应，仅当依赖变化时运行
const disposer2 = reaction(
    () => store.selectedDate,
    (date) => {
        console.log('reaction: selectedDate changed to', date);
    }
);

// when: 条件等待，条件满足时运行一次
when(
    () => store.flights.length > 0,
    () => {
        console.log('when: flights loaded, total price =', store.totalPrice);
    }
);

// ============================================
// 3. 操作演示
// ============================================
console.log('\n=== 3. 操作演示 ===');

// 初始状态
console.log('Initial flights:', store.flights);
console.log('Is loading:', store.isLoading);

// 加载航班
store.loadFlights('2024-01-15', 'price');

// 添加航班
setTimeout(() => {
    store.addFlight({ id: 4, flightNo: 'HU7890', airline: '海航', price: 520, favorite: false });
    console.log('After add:', store.flights.length);
}, 600);

// 切换收藏
setTimeout(() => {
    store.toggleFavorite(1);
    console.log('Favorite flights:', store.favoriteFlights.length);
}, 700);

// 排序
setTimeout(() => {
    store.setSortType('price');
    console.log('Sorted by price:', store.sortedFlights.map(f => f.price));
}, 800);

// ============================================
// 4. 手动创建Observable（不使用makeAutoObservable）
// ============================================
console.log('\n=== 4. 手动创建Observable ===');

const manualStore = observable({
    flights: [],
    
    // Action
    addFlight: action(function(flight) {
        this.flights.push(flight);
    }),
    
    // Computed
    get count() {
        return this.flights.length;
    }
});

manualStore.addFlight({ id: 1, flightNo: 'CA1234' });
console.log('Manual store count:', manualStore.count);

// ============================================
// 5. 数组和对象的响应式
// ============================================
console.log('\n=== 5. 数组和对象的响应式 ===');

const arrayStore = observable([1, 2, 3]);
const objectStore = observable({ name: 'Tom', age: 25 });

autorun(() => {
    console.log('Array sum:', arrayStore.reduce((a, b) => a + b, 0));
});

autorun(() => {
    console.log('Object:', objectStore.name, objectStore.age);
});

arrayStore.push(4);           // 触发响应
arrayStore[0] = 10;           // 触发响应
objectStore.name = 'Alice';    // 触发响应
objectStore.age = 26;         // 触发响应

// ============================================
// 6. MobX与React集成（概念说明）
// ============================================
console.log('\n=== 6. MobX与React集成 ===');

// 6.1 使用observer高阶组件
// import { observer } from 'mobx-react-lite';
// 
// const FlightList = observer(({ store }) => {
//     return (
//         <div>
//             {store.flights.map(flight => (
//                 <div key={flight.id}>{flight.flightNo}</div>
//             ))}
//         </div>
//     );
// });

// 6.2 使用useLocalObservable创建本地状态
// import { useLocalObservable, observer } from 'mobx-react-lite';
// 
// const Counter = observer(() => {
//     const state = useLocalObservable(() => ({
//         count: 0,
//         increment() { this.count++; },
//         decrement() { this.count--; }
//     }));
//     
//     return (
//         <div>
//             {state.count}
//             <button onClick={() => state.increment()}>+</button>
//             <button onClick={() => state.decrement()}>-</button>
//         </div>
//     );
// });

// ============================================
// 7. 完整流程总结
// ============================================
console.log('\n=== 7. MobX工作流程 ===');
console.log('1. 定义Observable状态');
console.log('2. 使用Action修改状态');
console.log('3. Computed自动追踪依赖并缓存结果');
console.log('4. Reaction/Observer响应状态变化');
console.log('5. React组件自动重新渲染');

// 清理
setTimeout(() => {
    disposer1();
    disposer2();
    console.log('\n=== MobX 学习完成 ===');
}, 1000);
