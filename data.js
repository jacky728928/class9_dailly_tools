/* =========================================================================
   班级管理数据文件 data.js
   说明：
   - 本文件是唯一需要维护的数据文件，由 index.html 通过 <script> 加载。
   - 既可在浏览器"设置"里编辑后自动回写，也可直接在此手动修改。
   - studentId 均指向 students[].id，便于改名不影响记录关联。
   ========================================================================= */
window.CLASS_DATA = {
  meta: {
    className: "高二（9）班",
    semester: "2026—2027学年第一学期（1-27周）",
    updated: "2026-08-31",
    homeRoom: "高二9班",
    // 学科 → 标签色（可自定义，缺省走默认灰）
    subjectColors: {
      "语文": "#e05858",
      "数学": "#4a7cf0",
      "英语": "#2eaf7d",
      "物理": "#8b5cf6",
      "化学": "#f59e0b",
      "生物": "#14b8a6",
      "政治": "#d63384",
      "历史": "#a16207",
      "地理": "#06b6d4",
      "体育": "#84cc16",
      "音乐": "#ec4899",
      "美术": "#f97316",
      "班会": "#6366f1",
      "自习": "#94a3b8",
      "走班": "#64748b",
      "艺术技术": "#db2777",
      "班校会": "#0ea5e9"
    }
  },

  // 学生名单
  students: [
    { id: 1,  name: "陈思远", studentNo: "01" },
    { id: 2,  name: "林雨桐", studentNo: "02" },
    { id: 3,  name: "周子轩", studentNo: "03" },
    { id: 4,  name: "黄诗涵", studentNo: "04" },
    { id: 5,  name: "赵宇辰", studentNo: "05" },
    { id: 6,  name: "沈梓涵", studentNo: "06" },
    { id: 7,  name: "刘梓豪", studentNo: "07" },
    { id: 8,  name: "王雨欣", studentNo: "08" },
    { id: 9,  name: "张子墨", studentNo: "09" },
    { id: 10, name: "李欣怡", studentNo: "10" }
  ],

  // 周课表：行=节次，列=周一~周五
  schedule: {
    periods: [
      { index: 1, time: "08:00-08:40" },
      { index: 2, time: "08:50-09:30" },
      { index: 3, time: "09:40-10:20" },
      { index: 4, time: "10:35-11:15" },
      { index: 5, time: "11:25-12:05" },
      { break: true, label: "午休", time: "12:05-13:30" },
      { index: 6, time: "13:30-14:10" },
      { index: 7, time: "14:40-15:20" },
      { index: 8, time: "15:35-16:15" },
      { index: 9, time: "16:25-17:05" }
    ],
    days: {
      "周一": [
        { subject: "语文", teacher: "叶青", room: "高二9班" },
        { subject: "数学", teacher: "彭红", room: "高二9班" },
        { subject: "数学", teacher: "彭红", room: "高二9班" },
        { subject: "走班", teacher: "历X1 徐晓枫 / 政X1 王潞玲 / 地X1 李娟", room: "1341教室 / 高二6班 / 高二9班" },
        { subject: "走班", teacher: "物X4 赵志龙 / 化X9 丁激扬 / 生X10 侯峰 / 政X3 王潞玲 / 地X3 赵云渤", room: "高二4班 / 高二9班 / 高二10班 / 1341教室 / 1111教室" },
        null,
        { subject: "走班", teacher: "物X9 刘一鸣 / 历X2 刘雨洁", room: "高二9班 / 1341教室" },
        { subject: "英语", teacher: "王宇[英]", room: "高二9班" },
        { subject: "体育", teacher: "", room: "" },
        { subject: "自习", teacher: "自习23", room: "高二9班" }
      ],
      "周二": [
        { subject: "数学", teacher: "彭红", room: "高二9班" },
        { subject: "英语", teacher: "王宇[英]", room: "高二9班" },
        { subject: "体育", teacher: "", room: "" },
        { subject: "艺术技术", teacher: "", room: "" },
        { subject: "语文", teacher: "叶青", room: "高二9班" },
        null,
        { subject: "走班", teacher: "政H3 王宇[政] / 自习", room: "高二3班 / 高二9班" },
        { subject: "走班", teacher: "物H1 石甄 / 政H8 黄亚庆 / 自习", room: "1341教室 / 高二8班 / 高二9班" },
        { subject: "自习", teacher: "", room: "" },
        { subject: "自习", teacher: "", room: "" }
      ],
      "周三": [
        { subject: "英语", teacher: "王宇[英]", room: "高二9班" },
        { subject: "走班", teacher: "物X9 刘一鸣 / 历X2 刘雨洁", room: "高二9班 / 1341教室" },
        { subject: "走班", teacher: "历X1 徐晓枫 / 政X1 王潞玲 / 地X1 李娟", room: "1341教室 / 高二6班 / 高二9班" },
        { subject: "体育", teacher: "", room: "" },
        { subject: "数学", teacher: "彭红", room: "高二9班" },
        null,
        { subject: "语文", teacher: "叶青", room: "高二9班" },
        { subject: "走班", teacher: "政H3 王宇[政] / 自习", room: "高二3班 / 高二9班" },
        { subject: "自习", teacher: "自习23", room: "高二9班" },
        { subject: "走班", teacher: "物X4 赵志龙 / 化X9 丁激扬 / 生X10 侯峰 / 政X3 王潞玲 / 地X3 赵云渤", room: "高二4班 / 高二9班 / 高二10班 / 1341教室 / 1111教室" }
      ],
      "周四": [
        { subject: "英语", teacher: "王宇[英]", room: "高二9班" },
        { subject: "体育", teacher: "", room: "" },
        { subject: "数学", teacher: "彭红", room: "高二9班" },
        { subject: "语文", teacher: "叶青", room: "高二9班" },
        { subject: "语文", teacher: "叶青", room: "高二9班" },
        null,
        { subject: "走班", teacher: "物X4 赵志龙 / 化X9 丁激扬 / 生X10 侯峰 / 政X3 王潞玲 / 地X3 赵云渤", room: "高二4班 / 高二9班 / 高二10班 / 1341教室 / 1111教室" },
        { subject: "走班", teacher: "历X1 徐晓枫 / 政X1 王潞玲 / 地X1 李娟", room: "1341教室 / 高二6班 / 高二9班" },
        { subject: "走班", teacher: "物X9 刘一鸣 / 历X2 刘雨洁", room: "高二9班 / 1341教室" },
        { subject: "走班", teacher: "物H1 石甄 / 政H8 黄亚庆 / 自习", room: "1341教室 / 高二8班 / 高二9班" }
      ],
      "周五": [
        { subject: "走班", teacher: "物X4 赵志龙 / 化X9 丁激扬 / 生X10 侯峰 / 政X3 王潞玲 / 地X3 赵云渤", room: "高二4班 / 高二9班 / 高二10班 / 1341教室 / 1111教室" },
        { subject: "走班", teacher: "历X1 徐晓枫 / 政X1 王潞玲 / 地X1 李娟", room: "1341教室 / 高二6班 / 高二9班" },
        { subject: "走班", teacher: "物X9 刘一鸣 / 历X2 刘雨洁", room: "高二9班 / 1341教室" },
        { subject: "英语", teacher: "王宇[英]", room: "高二9班" },
        { subject: "数学", teacher: "彭红", room: "高二9班" },
        null,
        { subject: "班校会", teacher: "", room: "" },
        { subject: "体育", teacher: "", room: "" },
        { subject: "艺术技术", teacher: "", room: "" },
        { subject: "语文", teacher: "叶青", room: "高二9班" }
      ]
    }
  },

  // 作业收交记录
  homework: [
    {
      id: "hw001",
      subject: "数学",
      title: "《课时练》P12-13",
      assignedDate: "2026-09-01",
      dueDate: "2026-09-03",
      submittedIds: [1, 2, 3, 5, 6, 8, 9]
    },
    {
      id: "hw002",
      subject: "语文",
      title: "背诵《劝学》全文",
      assignedDate: "2026-09-01",
      dueDate: "2026-09-02",
      submittedIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    {
      id: "hw003",
      subject: "英语",
      title: "Unit 1 单词抄写两遍",
      assignedDate: "2026-09-02",
      dueDate: "2026-09-04",
      submittedIds: [1, 2, 3, 4, 5, 6, 7]
    }
  ],

  // 考勤：按日期键，每人一条状态记录（present 到 / absent 缺 / late 迟 / leave 请）
  attendance: {
    "2026-09-01": [
      { studentId: 1,  status: "present" },
      { studentId: 2,  status: "present" },
      { studentId: 3,  status: "present" },
      { studentId: 4,  status: "present" },
      { studentId: 5,  status: "late" },
      { studentId: 6,  status: "present" },
      { studentId: 7,  status: "present" },
      { studentId: 8,  status: "leave" },
      { studentId: 9,  status: "present" },
      { studentId: 10, status: "present" }
    ],
    "2026-09-02": [
      { studentId: 1,  status: "present" },
      { studentId: 2,  status: "present" },
      { studentId: 3,  status: "present" },
      { studentId: 4,  status: "present" },
      { studentId: 5,  status: "present" },
      { studentId: 6,  status: "present" },
      { studentId: 7,  status: "present" },
      { studentId: 8,  status: "absent" },
      { studentId: 9,  status: "present" },
      { studentId: 10, status: "present" }
    ]
  },

  // 卫生打扫排班：按周
  cleaning: {
    schedule: [
      {
        weekStart: "2026-09-01",
        weekLabel: "第1周",
        tasks: [
          { area: "教室地面", studentIds: [1, 2] },
          { area: "黑板与讲台", studentIds: [3] },
          { area: "走廊与楼梯", studentIds: [4, 5] },
          { area: "室外卫生区", studentIds: [6, 7] },
          { area: "倒垃圾", studentIds: [8] }
        ]
      },
      {
        weekStart: "2026-09-08",
        weekLabel: "第2周",
        tasks: [
          { area: "教室地面", studentIds: [9, 10] },
          { area: "黑板与讲台", studentIds: [1] },
          { area: "走廊与楼梯", studentIds: [2, 3] },
          { area: "室外卫生区", studentIds: [4, 5] },
          { area: "倒垃圾", studentIds: [6] }
        ]
      }
    ]
  }
};
