// ============================================
// Redux 示例程序
// 涵盖核心知识点：Action、Reducer、Store、中间件、React-Redux、Redux Toolkit
// ============================================

// ============================================
// 1. 传统Redux实现
// ============================================
console.log('=== 1. 传统Redux实现 ===');

const redux = require('redux');
const { createStore, combineReducers, applyMiddleware } = redux;

// 1.1 Action类型定义
const ADD_FLIGHT = 'ADD_FLIGHT';
const DELETE_FLIGHT = 'DELETE_FLIGHT';
const SET_FLIGHTS = 'SET_FLIGHTS';
const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';

// 1.2 Action创建函数
function addFlight(flight) {
    return {
        type: ADD_FLIGHT,
        payload: flight
    };
}

function deleteFlight(id) {
    return {
        type: DELETE_FLIGHT,
        payload: id
    };
}

function setFlights(flights) {
    return {
        type: SET_FLIGHTS,
        payload: flights
    };
}

function toggleFavorite(id) {
    return {
        type: TOGGLE_FAVORITE,
        payload: id
    };
}

// 1.3 Reducer
function flightsReducer(state = [], action) {
    switch (action.type) {
        case ADD_FLIGHT:
            return [...state, action.payload];
        case DELETE_FLIGHT:
            return state.filter(flight => flight.id !== action.payload);
        case SET_FLIGHTS:
            return action.payload;
        case TOGGLE_FAVORITE:
            return state.map(flight => 
                flight.id === action.payload 
                    ? { ...flight, favorite: !flight.favorite }
                    : flight
            );
        default:
            return state;
    }
}

// 1.4 组合Reducer
const rootReducer = combineReducers({
    flights: flightsReducer
});

// 1.5 创建Store
const store = createStore(rootReducer);

// 1.6 订阅Store变化
store.subscribe(() => {
    console.log('Store更新:', store.getState());
});

// 1.7 触发Action
store.dispatch(setFlights([
    { id: 1, flightNo: 'CA1234', airline: '国航', price: 500, favorite: false },
    { id: 2, flightNo: 'MU5678', airline: '东航', price: 550, favorite: false }
]));

store.dispatch(addFlight({ id: 3, flightNo: 'CZ9012', airline: '南航', price: 480, favorite: false }));
store.dispatch(toggleFavorite(1));
store.dispatch(deleteFlight(2));

// ============================================
// 2. Redux中间件 - redux-thunk（异步操作）
// ============================================
console.log('\n=== 2. Redux中间件 - redux-thunk ===');

const thunk = require('redux-thunk').default;

// 创建带中间件的Store
const storeWithMiddleware = createStore(
    rootReducer,
    applyMiddleware(thunk)
);

// 异步Action（redux-thunk）
function fetchFlights() {
    return function(dispatch) {
        // 模拟异步请求
        dispatch({ type: 'FETCH_FLIGHTS_REQUEST' });
        
        setTimeout(() => {
            const flights = [
                { id: 1, flightNo: 'CA1234', airline: '国航', price: 500 },
                { id: 2, flightNo: 'MU5678', airline: '东航', price: 550 }
            ];
            
            dispatch(setFlights(flights));
            dispatch({ type: 'FETCH_FLIGHTS_SUCCESS' });
        }, 1000);
    };
}

// 调用异步Action
storeWithMiddleware.dispatch(fetchFlights());

// ============================================
// 3. Redux Toolkit实现（推荐方式）
// ============================================
console.log('\n=== 3. Redux Toolkit实现 ===');

const toolkit = require('@reduxjs/toolkit');
const { configureStore, createSlice, createAsyncThunk } = toolkit;

// 3.1 创建Async Thunk（异步操作）
const fetchFlightsAsync = createAsyncThunk(
    'flights/fetchFlights',
    async (params) => {
        const { date, sort } = params;
        console.log('请求参数:', { date, sort });
        
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return [
            { id: 1, flightNo: 'CA1234', airline: '国航', price: 500, date },
            { id: 2, flightNo: 'MU5678', airline: '东航', price: 550, date }
        ];
    }
);

// 3.2 创建Slice
const flightSlice = createSlice({
    name: 'flights',
    initialState: {
        data: [],
        status: 'idle', // idle, loading, succeeded, failed
        error: null
    },
    reducers: {
        addFlight: (state, action) => {
            state.data.push(action.payload);
        },
        toggleFavorite: (state, action) => {
            const flight = state.data.find(f => f.id === action.payload);
            if (flight) {
                flight.favorite = !flight.favorite;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFlightsAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFlightsAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchFlightsAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

// 3.3 创建Store（Redux Toolkit）
const toolkitStore = configureStore({
    reducer: {
        flights: flightSlice.reducer
    }
});

// 3.4 使用Action
toolkitStore.dispatch(addFlight({ id: 3, flightNo: 'CZ9012', airline: '南航', price: 480 }));
toolkitStore.dispatch(toggleFavorite(1));
toolkitStore.dispatch(fetchFlightsAsync({ date: '2024-01-15', sort: 'price' }));

// ============================================
// 4. React-Redux示例（概念说明）
// ============================================
console.log('\n=== 4. React-Redux使用 ===');

// 4.1 Provider包裹应用
// <Provider store={toolkitStore}>
//   <App />
// </Provider>

// 4.2 useSelector选择状态
// const flights = useSelector(state => state.flights.data);
// const status = useSelector(state => state.flights.status);

// 4.3 useDispatch获取dispatch
// const dispatch = useDispatch();
// dispatch(fetchFlightsAsync({ date, sort }));

// ============================================
// 5. 完整流程总结
// ============================================
console.log('\n=== 5. Redux工作流程 ===');
console.log('1. 组件调用 dispatch(action)');
console.log('2. Action被发送到Store');
console.log('3. Store调用Reducer处理状态变化');
console.log('4. Reducer返回新状态');
console.log('5. Store通知所有订阅者');
console.log('6. 组件重新渲染');

console.log('\n=== Redux 学习完成 ===');
