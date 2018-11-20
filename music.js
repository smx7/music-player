//audio元素对象（媒体）
var myAudio=$('audio')[0];
//歌词数组
var lyricArr=[];


//播放暂停控制
$(".btn1").click(function(){
    if(myAudio.paused){
        play()
    }
    else{
        pause()
    }
});
//频道切换
$(".btn2").click(function() {
    getchannel()
});

//切换音乐
$(".btn3").click(function() {
    getMusic()
});

//播放音乐
function play(){
    myAudio.play();
    $('.btn1').removeClass('m-play').addClass('m-pause');
}
//暂停
function pause(){
    myAudio.pause();
    $('.btn1').removeClass('m-pause').addClass('m-play');
}

//获取频道
function getchannel(){
    $.ajax({
        url:'http://api.jirengu.com/fm/getChannels.php',
        dataType:'json',//向后台传输的数据格式为json
        Method:'get',
        success:function(response){
            var channels=response.channels;
            var num=Math.floor(Math.random()*channels.length);
            var channelname=channels[num].name;
            var channelId=channels[num].channel_id;
            $('.record').text(channelname);
            $('.record').attr('title',channelname);
            $('.record').attr('data-id',channelId);
            getMusic();
        }

    })
}

/*//获取歌词
function getlyric(){
    var Sid = $('audio').attr('sid');
    var Ssid = $('audio').attr('ssid');
    //发送post请求
    $.post('http://api.jirengu.com/fm/getLyric.php', {ssid: Ssid, sid: Sid})
        .done(function (lyr){
            console.log(lyr);//控制台打印日志
            if(!lyr || lyr.indexOf('error')){
                $('.music-lyric .lyric').html("<li>本歌曲展示没有歌词</li>");
            }else{
                var lyr = JSON.parse(lyr);
                console.log(lyr);
                if (!!lyr.lyric) { // !:非
                    $('.music-lyric .lyric').empty();//清空歌词信息
                    var line = lyr.lyric.split('\n');//歌词为以排数为界的数组
                    var timeReg = /\[\d{2}:\d{2}.\d{2}\]/g;//时间的正则
                    var result = [];
                    if(line != ""){
                        for(var i in line){//遍历歌词数组
                            var time = line[i].match(timeReg);//每组匹配时间 得到时间数组
                            if(!time)continue;//如果没有 就跳过继续
                            var value = line[i].replace(timeReg,"");// 纯歌词
                            for(j in time){//遍历时间数组
                                var t = time[j].slice(1, -1).split(':');//分析时间  时间的格式是[00:00.00] 分钟和毫秒是t[0],t[1]
                                //把结果做成数组 result[0]是当前时间，result[1]是纯歌词
                                var timeArr = parseInt(t[0], 10) * 60 + parseFloat(t[1]); //计算出一个curTime s为单位
                                result.push([timeArr, value]);
                            }
                        }
                    }//result:结果集 当前时间和歌词


                    //时间排序
                    result.sort(function (a, b) {
                        return a[0] - b[0];
                    });
                    lyricArr = result;//存到lyricArr里面
                    renderLyric();//渲染歌词
                }

            }
        }).fail(function(){
        $('.music-lyric .lyric').html("<li>本歌曲展示没有歌词</li>");
    })
}
function renderLyric(){
    var lyrLi = "";
    for (var i = 0; i < lyricArr.length; i++) {
        lyrLi += "<li data-time='"+lyricArr[i][0]+"'>"+lyricArr[i][1]+"</li>";//创建歌词 li
    }
    $('.music-lyric .lyric').append(lyrLi);//给class为 music-lyric lyric  添加属性；
    setInterval(showLyric,100);//怎么展示歌词
}
function showLyric(){
    var liH = $(".lyric li").eq(5).outerHeight()-3; //每行高度
    for(var i=0;i< lyricArr.length;i++){//遍历歌词下所有的li
        var curT = $(".lyric li").eq(i).attr("data-time");//获取当前li存入的当前一排歌词时间
        var nexT = $(".lyric li").eq(i+1).attr("data-time");
        var curTime = myAudio.currentTime;
        if ((curTime > curT) && (curT < nexT)){//当前时间在下一句时间和歌曲当前时间之间的时候 就渲染 并滚动
            $(".lyric li").removeClass("active");
            $(".lyric li").eq(i).addClass("active");
            $('.music-lyric .lyric').css('top', -liH*(i-2));
        }
    }
}*/
//获取歌词
function getlyric(){
    var Sid = $('audio').attr('sid');
    var Ssid = $('audio').attr('ssid');
    //发送post请求
    $.post('http://api.jirengu.com/fm/getLyric.php', {ssid: Ssid, sid: Sid})
        .done(function (lyr){
            console.log(lyr);//控制台打印日志
            var lyr = JSON.parse(lyr);;
            console.log(lyr);
            if (!!lyr.lyric) { // !:非
                $('.music-lyric .lyric').empty();//清空歌词信息
                var line = lyr.lyric.split('\n');//歌词为以排数为界的数组
                var timeReg = /\[\d{2}:\d{2}.\d{2}\]/g;//时间的正则
                var result = [];
                if(line != ""){
                    for(var i in line){//遍历歌词数组
                        var time = line[i].match(timeReg);//每组匹配时间 得到时间数组
                        if(!time)continue;//如果没有 就跳过继续
                        var value = line[i].replace(timeReg,"");// 纯歌词
                        for(j in time){//遍历时间数组
                            var t = time[j].slice(1, -1).split(':');//分析时间  时间的格式是[00:00.00] 分钟和毫秒是t[0],t[1]
                            //把结果做成数组 result[0]是当前时间，result[1]是纯歌词
                            var timeArr = parseInt(t[0], 10) * 60 + parseFloat(t[1]); //计算出一个curTime s为单位
                            result.push([timeArr, value]);
                        }
                    }
                }//result:结果集 当前时间和歌词


                //时间排序
                result.sort(function (a, b) {
                    return a[0] - b[0];
                });
                lyricArr = result;//存到lyricArr里面
                renderLyric();//渲染歌词
            }
        }).fail(function(){
        $('.music-lyric .lyric').html("<li>本歌曲展示没有歌词</li>");
    })
}
function renderLyric(){
    var lyrLi = "";
    for (var i = 0; i < lyricArr.length; i++) {
        lyrLi += "<li data-time='"+lyricArr[i][0]+"'>"+lyricArr[i][1]+"</li>";//创建歌词 li
    }
    $('.music-lyric .lyric').append(lyrLi);//给class为 music-lyric lyric  添加属性；
    setInterval(showLyric,100);//怎么展示歌词
}
function showLyric(){
    var liH = $(".lyric li").eq(5).outerHeight()-3; //每行高度
    for(var i=0;i< lyricArr.length;i++){//遍历歌词下所有的li
        var curT = $(".lyric li").eq(i).attr("data-time");//获取当前li存入的当前一排歌词时间
        var nexT = $(".lyric li").eq(i+1).attr("data-time");
        var curTime = myAudio.currentTime;
        if ((curTime > curT) && (curT < nexT)){//当前时间在下一句时间和歌曲当前时间之间的时候 就渲染 并滚动
            $(".lyric li").removeClass("active");
            $(".lyric li").eq(i).addClass("active");
            $('.music-lyric .lyric').css('top', -liH*(i-2));
        }
    }
}
//获取音乐的方法
function getMusic(){
    $.ajax({
        url:'http://api.jirengu.com/fm/getSong.php',
        dataType:'json',
        Method:'get',
        data:{
            'channel':$('.record').attr('data-id'),

        },
        success:function(ret) {
            var resource=ret.song[0];//歌曲对象信息
            var url=resource.url;//歌曲链接
            var bgPic=resource.picture;//歌曲背景图片
            var sid=resource.sid;//歌曲sid
            var ssid=resource.ssid;//歌曲ssid
            var title=resource.title;
            var author=resource.artist;//歌手

            $('audio').attr('src',url);//对audio元素添加src属性的值 $('.**')
            $('audio').attr('sid',sid);
            $('audio').attr('ssid',ssid);
            $('.musicName').text(title);//对叫musicName的元素添加文本
            $('.musicName').attr('title',title);//对class为musicName的元素添加title属性的值
            $('.musician').text(author);
            $('.musician').attr('author',author);
            $('.background').css({
                'background':'url('+bgPic+')',
                'background-repeat':'no-repeat',
                'background-position':'center',
                'background-size':'cover',
            })

            getlyric();

        }
    })
}
//进度条控制
setInterval(present,500)	//每0.5秒计算进度条长度
$(".basebar").mousedown(function(ev){  //拖拽进度条控制进度
    var posX = ev.clientX;
    var targetLeft = $(this).offset().left;
    var percentage = (posX - targetLeft)/400*100;
    myAudio.currentTime = myAudio.duration * percentage/100;
});
function present(){
    var length = myAudio.currentTime/myAudio.duration*100;
    $('.progressbar').width(length+'%');//设置进度条长度
    //自动下一曲
    if(myAudio.currentTime == myAudio.duration){
        getmusic()
    }
}

//icon 收藏
$('.m-star').on('click',function () {
    $(this).toggleClass('stared')
})
//icon喜欢
$('.m-heart').on('click',function () {
    $(this).toggleClass('loved')
})
$('.m-lyric').on('click',function () {
    $(this).toggleClass('lyriced');
    if($(this).hasClass('lyriced')){
        $('.music-lyric').css({'display':'block'})
    }else{
        $('.music-lyric').css({'display':'none'})
    }
})
$('.m-xunhuan').on('click',function(){
    $(this).toggleClass('recycleed').toggleClass('colored')
    if($(this).hasClass('recycleed')){
        $('audio').attr('loop','loop');
    }
    if($(this).hasClass('colored')){
        $('audio').removeAttr('loop','no-loop');
    }
})
$(document).ready(getchannel());//页面在准备加载的时候调用getChannel方法