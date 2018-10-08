/**
 * Created by Administrator on 2018/10/8.
 * just copy by bottom
 */

//����һ�����󷽷�
function Visualizer() {
    //�Ȱ��Լ��ñ�����������,����Ҫ��
    var Myself = this;
    //Ƶ������,�ⲿ���þͿ�ʼ���д���
    this.config = function (Object) {
        Myself.audioUrl = Object.audioUrl;
        Myself.canvasId = Object.canvasId;
        windowAudioContext();
    }
    //������ЩΪ�ڲ�����,�ⲿ���ɷ���

    //ʵ����һ����Ƶ����window.AudioContext
    function windowAudioContext() {
        //������Щ��Ϊ��ͳһChrome��Firefox��AudioContext
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
        try {
            Myself.audioContext = new AudioContext();
            //AudioContextʵ���������ȡ��Ƶ
            loadSound();
        } catch (e) {
            console.log(e + ',�����������֧�� AudioContext');
        }
    }

    //������Ƶ���󷽷�
    function loadSound() {
        var request = new XMLHttpRequest(); //����һ������
        request.open('GET', Myself.audioUrl, true); //�����������ͣ��ļ�·��,·�����ɿ���
        request.responseType = 'arraybuffer'; //�������ݷ�������
        request.onload = function () {
            //��ȡ�ɹ�����ArrayBuffer(һ���ڴ�ռ�,����),���ò���
            play(request.response);
        }
        request.send();
    }

    //���벥��,��ȡ����
    function play(audioData) {
        var audioContext = Myself.audioContext;
        //����ArrayBuffer
        audioContext.decodeAudioData(audioData).then(function (decodedData) {
            //�������������������
            //AudioBuffer�ӿڱ�ʾ���ڴ洢����Ķ���Ƶ�ʲ�������AudioContext.decodeAudioData()��������Ƶ�ļ�������
            // �������� AudioContext.createBuffer()������ԭ���ݡ�
            // һ���������AudioBuffer�����Դ��ݵ�һ�� AudioBufferSourceNode���в���
            var audioBufferSouceNode = audioContext.createBufferSource(),
                analyser = audioContext.createAnalyser();
            //��source�����������
            audioBufferSouceNode.connect(analyser);
            //����������destination���ӣ��γɵ�����������ͨ·
            analyser.connect(audioContext.destination);
            //���������õ���decodedData���ݸ�ֵ��source
            audioBufferSouceNode.buffer = decodedData;
            //����,������Ϳ�������������
            audioBufferSouceNode.start(0);
            //�������ѷ���������ȥ����Ƶ��
            drawSpectrum(analyser);
        }, function (e) {
            console.log(e + ",�ļ�����ʧ��!");
        });

    }
    //����Ƶ��
    function drawSpectrum(analyser) {
        //��ɫ����
        var colorArray=['#f82466','#00FFFF','#AFFF7C','#FFAA6A','#6AD5FF','#D26AFF','#FF6AE6','#FF6AB8','#FF6A6A'];
        //��ɫ�����
        var colorRandom=Math.floor(Math.random()*colorArray.length);
        //Ч�������
        var effectRandom=Math.floor(Math.random()*1);
        //���ѡȡ��ɫ
        Myself.color=colorArray[colorRandom];
        //���ѡȡЧ��
        switch(effectRandom)
        {
            case 0:
                //����
                bar(analyser);
                break;
            default:
                //����
                bar(analyser);
        }

    }
    //��״Ч��
    function bar(analyser) {
        var canvas = document.getElementById(Myself.canvasId),
            cwidth = canvas.width,
            cheight = canvas.height - 2,
            meterWidth = 10, //Ƶ�������
            gap = 2, //Ƶ�������
            capHeight = 2,
            capStyle = '#fff',
            meterNum = 800 / (10 + 2), //Ƶ��������
            capYPositionArray = []; //����һ�����ñͷ��λ�ñ��浽�������
        ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(1, Myself.color);
        var drawMeter = function () {
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            var step = Math.round(array.length / meterNum); //�����������
            ctx.clearRect(0, 0, cwidth, cheight);
            for (var i = 0; i < meterNum; i++) {
                var value = array[i * step]; //��ȡ��ǰ����ֵ
                if (capYPositionArray.length < Math.round(meterNum)) {
                    capYPositionArray.push(value); //��ʼ������ñͷλ�õ����飬����һ�����������ѹ������
                }
                ;
                ctx.fillStyle = capStyle;
                //��ʼ����ñͷ
                if (value < capYPositionArray[i]) { //�����ǰֵС��֮ǰֵ
                    ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight); //��ʹ��ǰһ�α����ֵ������ñͷ
                } else {
                    ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight); //����ʹ�õ�ǰֱֵ�ӻ���
                    capYPositionArray[i] = value;
                }
                ;
                //��ʼ����Ƶ����
                ctx.fillStyle = gradient;
                ctx.fillRect(i * 12, cheight - value + capHeight, meterWidth, cheight);
            }
            requestAnimationFrame(drawMeter);
        }
        requestAnimationFrame(drawMeter);
    }

}