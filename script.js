const template = document.querySelector('template');

const container = document.body.querySelector('.container');

let limit=1,symbol='AAVEUSDT',interval='1d',refresh=10000;
let wrappers;
let min = 99999999
function doSort(){
    min = Number(min);
    wrappers.forEach(element=>{
        let num = Number(element.querySelector('.change').innerText)
        let order = Math.ceil(num-min);
        console.log(element.querySelector('.name').innerText,order,num,min)
        element.style.order = order.toLocaleString();
    })
}

function createUI(data){
    if(!data.symbol.match("USDT")) return
    if(data.symbol.match("UP")) return
    if(data.symbol.match("DOWN")) return
    const wrapper = template.content.cloneNode(true);
    wrapper.querySelector('.name').innerText = data.name;
    wrapper.querySelector('.link').href = `https://www.binance.com/en/trade/${data.symbol}`;
    wrapper.querySelector('.price').innerText = data.price;
    wrapper.querySelector('.change').innerText = data.dayChange;
    wrapper.querySelector('.wrapper').dataset.symbol=data.symbol;
    wrapper.querySelector('.tags').innerText=data.tags?.join() || "N/A";
    container.append(wrapper);
}

function getMinMax(value){
    value = Number(value)
    //console.log(value,min, value<min)
    if(value<min) min = value;
}

function loadSingleData(url,element){
    

    fetch(url).then(function (response) {
        return response.json();
        }).then(function (data) {
            element.querySelector('.price').innerText = data[0][4];
            let data4 = Number(data[0][4]), data1 = Number(data[0][1]);

            const diff = data[0][4] - data[0][1]
            if(diff<0) {
                element.querySelector('.change').innerText = (diff/data[0][4]*100).toFixed(2);
                getMinMax(((data4-data1)/data4*100).toFixed(2));
                element.querySelector('.change').classList.remove('green');
                element.querySelector('.change').classList.add('red');

                element.querySelector('.parcent').classList.remove('green');
                element.querySelector('.parcent').classList.add('red');
            }
            else {
                element.querySelector('.change').innerText = (diff/data[0][1]*100).toFixed(2);
                getMinMax(((data4-data1)/data1*100).toFixed(2));
                element.querySelector('.change').classList.remove('red');
                element.querySelector('.change').classList.add('green');
                element.querySelector('.parcent').classList.remove('red');
                element.querySelector('.parcent').classList.add('green');
            }
        }).catch(function (err) {
            console.warn('Something went loading single data.', err);
        });
}

function thread(){
    min = 99999999;
    wrappers.forEach(element=>{
        loadSingleData(`https://www.binance.com/api/v3/klines?limit=${limit}&symbol=${element.dataset.symbol}&interval=${interval}`,element);
    })
    setTimeout(()=>doSort(),3000);
}

function loadData(url){
    fetch(url).then(function (response) {
    return response.json();
    }).then(function (data) {
        
        data.data.forEach(element => {
            createUI(element);    
        });
        wrappers = document.querySelector('.container').querySelectorAll('.wrapper');
        //setInterval(thread,refresh);
        thread();
        document.querySelector('.btn').onclick = thread;
    }).catch(function (err) {
        console.warn('Something went wrong. loading all data', err);
    });
}

function logSelection(event) {
    const selection = event.target.value.substring(event.target.selectionStart, event.target.selectionEnd);
    interval = selection;
    thread();
  }
function inputhandler(event){
    console.log(event.target.value);
}
function submithndlr(event){
    event.preventDefault();
}

  document.querySelector('#time').onchange = logSelection;

loadData('https://www.binance.com/bapi/composite/v1/public/marketing/symbol/list');


/*

fetch('https://www.binance.com/bapi/composite/v1/public/marketing/symbol/list').then(function (response) {
    return response.json();
    }).then(function (data) {
        console.log(data);
    }).catch(function (err) {
        console.warn('Something went wrong.', err);
    });

*/