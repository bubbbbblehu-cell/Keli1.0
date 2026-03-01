export interface DetectionType {
  id: string;
  name: string;
  icon: string;
  description: string;
  question: string;
  riskWarning: string;
}

export const DETECTION_TYPES: DetectionType[] = [
  {
    id: 'door_lock',
    name: '门锁安全检查',
    icon: '🔒',
    description: '检查门锁是否牢固',
    question: '握住门把手摇晃，是否感觉到明显松动或听到零件撞击声？',
    riskWarning: '门锁松动极可能是被撬动的痕迹，或内部反锁机构已失效',
  },
  {
    id: 'window',
    name: '窗户外部检查',
    icon: '🪟',
    description: '检查窗外是否有攀爬风险',
    question: '观察窗外 1 米内是否有空调外机、水管或邻居阳台？',
    riskWarning: '这类外部结构是天然的攀爬踏板，极易发生入室风险',
  },
  {
    id: 'mirror',
    name: '双面镜检测',
    icon: '🪞',
    description: '检测镜子是否为双面镜',
    question: '用手指关节敲击镜面，声音是闷响还是空心的脆响？',
    riskWarning: '脆响意味着镜后有空腔，极大概率是"双面镜"偷拍',
  },
  {
    id: 'bathroom',
    name: '浴室通风口检查',
    icon: '🚿',
    description: '检查浴室通风口是否有异常',
    question: '观察排气扇格栅内部是否有黑色圆孔或红点红光？',
    riskWarning: '通风口是隐藏摄像头的重灾区，红点通常是设备工作灯',
  },
  {
    id: 'socket',
    name: '插座与面板检查',
    icon: '🔌',
    description: '检查插座是否有异常',
    question: '检查正对床铺的插座孔位，是否有反光点或异常缝隙？',
    riskWarning: '改装插座可提供长久电源给针孔设备',
  },
  {
    id: 'router',
    name: '路由器与信号检查',
    icon: '📡',
    description: '检查路由器是否有异常',
    question: '路由器背面除了网线，是否有不明的微小孔洞或多余接线？',
    riskWarning: '路由器常被植入网络嗅探或无线传输型偷拍模组',
  },
];

