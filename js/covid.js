
// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Area Chart Example
function timeSeriesCases(casesKeys,casesVals) {

    var ctx = document.getElementById("myAreaChart");
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [casesKeys[casesKeys.length-26],casesKeys[casesKeys.length-23],casesKeys[casesKeys.length-19],casesKeys[casesKeys.length-16],casesKeys[casesKeys.length-13],casesKeys[casesKeys.length-9],casesKeys[casesKeys.length-6],casesKeys[casesKeys.length-3],casesKeys[casesKeys.length-1]],
            datasets: [{
                label: "Cases",
                lineTension: 0.3,
                backgroundColor: "rgba(216,160,0,0.2)",
                borderColor: "rgb(216,73,19)",
                pointRadius: 5,
                pointBackgroundColor: "rgb(255,188,0)",
                pointBorderColor: "rgba(255,255,255,0.8)",
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgb(255,188,0)",
                pointHitRadius: 50,
                pointBorderWidth: 2,
                data: [casesVals[casesVals.length-26],casesVals[casesVals.length-23],casesVals[casesVals.length-19],casesVals[casesVals.length-16],casesVals[casesVals.length-13],casesVals[casesVals.length-9],casesVals[casesVals.length-6],casesVals[casesVals.length-3],casesVals[casesVals.length-1]],
            }],
        },
        options: {
            scales: {
                xAxes: [{
                    time: {
                        unit: 'date'
                    },
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 7
                    }
                }],
                yAxes: [{
                    // ticks: {
                    //   maxTicksLimit: 5
                    // },
                    gridLines: {
                        color: "rgba(0, 0, 0, .125)",
                    }
                }],
            },
            legend: {
                display: false
            }
        }
    });

}

function pieChart(Deaths,Cases,Recovered) {

    var ctx = document.getElementById("myPieChart2");
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ["Deaths","Cases","Recovered"],
            datasets: [{
                data: [ Deaths,Cases,Recovered],
                backgroundColor: [ '#dc3545', '#ffc107', '#28a745'],
            }],
        },
    });

}

window.onload=function () {

    HistoricalDataAll();

    let xhr=new XMLHttpRequest();
    xhr.open('GET','https://corona.lmao.ninja/all');
    xhr.onload=function () {
        if (this.status===200){
             allData=JSON.parse(this.responseText);
             document.getElementById('Cases').innerText=allData.cases;
            document.getElementById('recovered').innerText=allData.recovered;
            document.getElementById('deaths').innerText=allData.deaths;
            document.getElementById('todayCases').innerText=allData.todayCases;
            document.getElementById('active').innerText=allData.active;
            document.getElementById('tests').innerText=allData.tests;

            pieChart(allData.deaths,allData.cases,allData.recovered);
        }
    };
    xhr.send();

    let AllCountries=new XMLHttpRequest();

    AllCountries.open('GET','https://corona.lmao.ninja/v2/countries');
    AllCountries.onload=function () {
        if (this.status===200){
            let allCountryData=JSON.parse(this.responseText);

            let countryOptions=`<option selected disabled>---Select Country to View It's Data--</option>`;
            let trs='';
            allCountryData.forEach(function (country) {
                    countryOptions +=`<option>${country.country}</option>`;
                    document.getElementById('countries').innerHTML=countryOptions;
                    trs+=` <tr role="row" class="odd">              
                                            <td ><img src="${country.countryInfo.flag}" alt="" height="30%"> <br> <h6>${country.country}</h6></td>                                         
                                            <td>${country.cases}</td>
                                            <td>${country.todayCases}</td>
                                            <td>${country.deaths}</td>
                                            <td>${country.todayDeaths}</td>
                                            <td>${country.recovered}</td>
                                            <td>${country.active}</td>
                                            <td>${country.tests}</td>
                                        </tr>`
            });
            document.getElementById('countryData').innerHTML=trs;
        }
        var TBA_table = $('#dataTable').DataTable({
            responsive: true,

        });

        new $.fn.dataTable.FixedHeader(TBA_table);


    };
    AllCountries.send();

    

};



let countryUI=document.getElementById('countries');
countryUI.addEventListener('change',showBycountry);

function showBycountry(e) {
    e.preventDefault();

    timechartUI=document.getElementById('timeCharDiv');
    barchartUI=document.getElementById('barchartDIv');
    timechartUI.innerHTML='';
    timechartUI.innerHTML=`<canvas id="myAreaChart" width="100%" height="40"></canvas>`;
    barchartUI.innerHTML='';
    barchartUI.innerHTML=`<canvas id="myPieChart2" width="100%" height="40"></canvas>`;
    document.getElementById('Data_location').innerHTML=countryUI.value;
    HistoricalDataCountry(countryUI.value);
    getCovidDataByCountry(countryUI.value);

}



function HistoricalDataCountry(country) {
    let sets;
    let casesKeys=[];
    let casesVals=[];
    xhr=new XMLHttpRequest();
    xhr.open('GET',`https://corona.lmao.ninja/v2/historical/${country}`);
    xhr.onload=function(){
        let history=JSON.parse(this.responseText);

        sets=history.timeline.cases;
        $.each(sets,function(key,val){
            casesKeys.push(key);
            casesVals.push(val);
        });
        timeSeriesCases(casesKeys,casesVals)
    };


    xhr.send()
}
function HistoricalDataAll() {
    let sets;
    let casesKeys=[];
    let casesVals=[];
    xhr=new XMLHttpRequest();
    xhr.open('GET','https://corona.lmao.ninja/v2/historical/all');
    xhr.onload=function(){
        let history=JSON.parse(this.responseText);

        sets=history.cases;
        $.each(sets,function(key,val){
            casesKeys.push(key);
            casesVals.push(val);
        });
        timeSeriesCases(casesKeys,casesVals)
    };


    xhr.send()
}

function getCovidDataByCountry(country) {
    let outputCardsContainer=document.getElementById('outputCardsContainer');
    let xhr=new XMLHttpRequest();
    xhr.open('GET',`https://corona.lmao.ninja/v2/countries/${country}`);
    xhr.onload=function () {
        if (this.status===200){
            allData=JSON.parse(this.responseText);
            document.getElementById('Cases').innerText=allData.cases;
            document.getElementById('recovered').innerText=allData.recovered;
            document.getElementById('deaths').innerText=allData.deaths;
            document.getElementById('todayCases').innerText=allData.todayCases;
            document.getElementById('active').innerText=allData.active;
            document.getElementById('tests').innerText=allData.tests;
            pieChart(allData.deaths,allData.cases,allData.recovered);
            outputCardsContainer.style.backgroundImage=`unset`;
            outputCardsContainer.style.backgroundImage=`url('${allData.countryInfo.flag}')`;
            outputCardsContainer.style.backgroundSize='cover';
        }
    };
    xhr.send();
}