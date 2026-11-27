/* Fixed-version local passages for the portfolio search sample. */
window.manualSampleCorpus = [
  {
    "id": "clinic-L3",
    "project": "clinic",
    "document": "门诊候补与改约工作台",
    "text": "预约窗口可以在同一个工作台查号、登记预约、办理候补和停诊改约。日程显示所选日期的号源分布、各班次的余号和名单。“窗口待办”汇总各日期的待办记录，点击一项即可查看对应状态的预约。接到咨询时，也可以按就诊编号或预约单号追查办理经过。项目使用合成排班与虚构编号，每个浏览器会话有独立的数据。",
    "start": 3,
    "end": 3,
    "version": "v0.6",
    "url": "https://github.com/fate788/clinic-scheduling/blob/bf00adf19b6588e4800e48f25bd487980f0a0119/README.md?plain=1#L3"
  },
  {
    "id": "clinic-L7",
    "project": "clinic",
    "document": "门诊候补与改约工作台",
    "text": "预约日程展示导诊大厅，查询页展示窗口递单，停诊改约页展示诊区走廊导引。三张图片由 AI 为本项目生成，人物与机构均为虚构。图片随页面提供，可离线显示。",
    "start": 7,
    "end": 7,
    "version": "v0.6",
    "url": "https://github.com/fate788/clinic-scheduling/blob/bf00adf19b6588e4800e48f25bd487980f0a0119/README.md?plain=1#L7"
  },
  {
    "id": "clinic-L11",
    "project": "clinic",
    "document": "门诊候补与改约工作台",
    "text": "需要 Python 3.10 或更新版本，只使用 Python 标准库。在项目根目录执行以下命令。\npython server.py",
    "start": 11,
    "end": 15,
    "version": "v0.6",
    "url": "https://github.com/fate788/clinic-scheduling/blob/bf00adf19b6588e4800e48f25bd487980f0a0119/README.md?plain=1#L11-L15"
  },
  {
    "id": "clinic-L17",
    "project": "clinic",
    "document": "门诊候补与改约工作台",
    "text": "打开本机工作台（http://127.0.0.1:8796/）。Windows 也可双击 start-clinic.cmd。服务默认只监听本机回环地址。可通过 --port 和 --db 指定端口和 SQLite 文件。",
    "start": 17,
    "end": 17,
    "version": "v0.6",
    "url": "https://github.com/fate788/clinic-scheduling/blob/bf00adf19b6588e4800e48f25bd487980f0a0119/README.md?plain=1#L17"
  },
  {
    "id": "clinic-L21",
    "project": "clinic",
    "document": "门诊候补与改约工作台",
    "text": "跨日登记。 从 12 月 8 日的日程打开快速登记，选择 12 月 9 日 09:00 综合门诊 S03。用虚构就诊编号 P105 登记后，在预约查询中输入 P105，即可核对班次、预约状态和办理记录。",
    "start": 21,
    "end": 21,
    "version": "v0.6",
    "url": "https://github.com/fate788/clinic-scheduling/blob/bf00adf19b6588e4800e48f25bd487980f0a0119/README.md?plain=1#L21"
  },
  {
    "id": "clinic-L22",
    "project": "clinic",
    "document": "门诊候补与改约工作台",
    "text": "退号与递补。 在周日历选 12 月 8 日，打开 09:00 综合门诊 S01，取消预约 R001。队首 P003 获得 10 分钟留位。把演示时钟推进 10 分钟，留位转给 P004。使用 P004 确认，查询预约单 R004 可核对递补经过。",
    "start": 22,
    "end": 22,
    "version": "v0.6",
    "url": "https://github.com/fate788/clinic-scheduling/blob/bf00adf19b6588e4800e48f25bd487980f0a0119/README.md?plain=1#L22"
  },
  {
    "id": "clinic-L23",
    "project": "clinic",
    "document": "门诊候补与改约工作台",
    "text": "停诊改约。 重置演示，将 S01 停诊。在改约页勾选 R001、R002，核对原班次和目标班次，选择同科 10:00 的 S02 并确认。两笔预约一起转入该班次，事件记录保留每笔改约的起点和去向。",
    "start": 23,
    "end": 23,
    "version": "v0.6",
    "url": "https://github.com/fate788/clinic-scheduling/blob/bf00adf19b6588e4800e48f25bd487980f0a0119/README.md?plain=1#L23"
  },
  {
    "id": "clinic-L25",
    "project": "clinic",
    "document": "门诊候补与改约工作台",
    "text": "下拉菜单支持键盘操作。用 Tab 聚焦后按 Enter 展开，用上下方向键浏览，按 Enter 选定或 Esc 收起。",
    "start": 25,
    "end": 25,
    "version": "v0.6",
    "url": "https://github.com/fate788/clinic-scheduling/blob/bf00adf19b6588e4800e48f25bd487980f0a0119/README.md?plain=1#L25"
  },
  {
    "id": "clinic-L27",
    "project": "clinic",
    "document": "门诊候补与改约工作台",
    "text": "初始演示时钟固定为北京时间 2026 年 12 月 7 日 08:40，时钟由操作者推进。刷新页面可以继续刚才的演练。事件和留位提醒显示在工作台内。系统没有连接医院挂号系统或短信服务。",
    "start": 27,
    "end": 27,
    "version": "v0.6",
    "url": "https://github.com/fate788/clinic-scheduling/blob/bf00adf19b6588e4800e48f25bd487980f0a0119/README.md?plain=1#L27"
  },
  {
    "id": "clinic-L31",
    "project": "clinic",
    "document": "门诊候补与改约工作台",
    "text": "engine.py 管理号源、候补队列、场次停开和事件记录。SQLite 写事务把余量判断和状态变化一起提交，已确认和已留位都会占用容量。",
    "start": 31,
    "end": 31,
    "version": "v0.6",
    "url": "https://github.com/fate788/clinic-scheduling/blob/bf00adf19b6588e4800e48f25bd487980f0a0119/README.md?plain=1#L31"
  },
  {
    "id": "clinic-L32",
    "project": "clinic",
    "document": "门诊候补与改约工作台",
    "text": "server.py 提供静态界面、GET /api/state 与 POST /api/action。操作可携带版本号与请求标识，对过期页面返回冲突，重复请求可取回当前状态。",
    "start": 32,
    "end": 32,
    "version": "v0.6",
    "url": "https://github.com/fate788/clinic-scheduling/blob/bf00adf19b6588e4800e48f25bd487980f0a0119/README.md?plain=1#L32"
  },
  {
    "id": "clinic-L33",
    "project": "clinic",
    "document": "门诊候补与改约工作台",
    "text": "static/ 提供周日历、当日号源分布、快速登记、预约查询、停诊改约与事件记录。中文字体内嵌于 static/style.css，许可见 static/fonts/OFL.txt。",
    "start": 33,
    "end": 33,
    "version": "v0.6",
    "url": "https://github.com/fate788/clinic-scheduling/blob/bf00adf19b6588e4800e48f25bd487980f0a0119/README.md?plain=1#L33"
  },
  {
    "id": "clinic-L34",
    "project": "clinic",
    "document": "门诊候补与改约工作台",
    "text": "执行 python -m unittest discover -v 复跑测试。GitHub Actions 在提交和拉取请求时运行测试并检查前端脚本语法。",
    "start": 34,
    "end": 34,
    "version": "v0.6",
    "url": "https://github.com/fate788/clinic-scheduling/blob/bf00adf19b6588e4800e48f25bd487980f0a0119/README.md?plain=1#L34"
  },
  {
    "id": "clinic-L36",
    "project": "clinic",
    "document": "门诊候补与改约工作台",
    "text": "15 项测试覆盖候补先后、截止时刻、跨日、停诊、事务回滚、重试和工作区隔离。在单席并发测试中，12 个请求同时登记，结果是 1 条已预约、11 条候补。在批次测试中，后一条预约遇到时段冲突时，先处理的预约和对应事件也一起回滚。",
    "start": 36,
    "end": 36,
    "version": "v0.6",
    "url": "https://github.com/fate788/clinic-scheduling/blob/bf00adf19b6588e4800e48f25bd487980f0a0119/README.md?plain=1#L36"
  },
  {
    "id": "clinic-L38",
    "project": "clinic",
    "document": "门诊候补与改约工作台",
    "text": "作者是李子衡（@fate788）。个人博客源码与其他作品",
    "start": 38,
    "end": 38,
    "version": "v0.6",
    "url": "https://github.com/fate788/clinic-scheduling/blob/bf00adf19b6588e4800e48f25bd487980f0a0119/README.md?plain=1#L38"
  },
  {
    "id": "ledger-L3",
    "project": "ledger",
    "document": "双账核对工作台",
    "text": "给运营或财务核对系统订单与渠道账单。把两侧数据转换为相同的三列 CSV，导入后可按差异类别和业务单号筛选，核对原始行、记录复核结论并导出报告。内置样例为合成数据。",
    "start": 3,
    "end": 3,
    "version": "v0.2",
    "url": "https://github.com/fate788/ledger-reconciliation/blob/97649044221e9a7bde0100948efba7b617b995b3/README.md?plain=1#L3"
  },
  {
    "id": "ledger-L7",
    "project": "ledger",
    "document": "双账核对工作台",
    "text": "作品分类　产品研发 / 业务后端、Web 前端，数据工程 / 数据质量。行业为电商与支付。",
    "start": 7,
    "end": 7,
    "version": "v0.2",
    "url": "https://github.com/fate788/ledger-reconciliation/blob/97649044221e9a7bde0100948efba7b617b995b3/README.md?plain=1#L7"
  },
  {
    "id": "ledger-L11",
    "project": "ledger",
    "document": "双账核对工作台",
    "text": "克隆仓库后进入项目根目录，使用 Python 3.10 或更新版本。Windows 可双击 start-review.cmd，也可在本目录运行 python server.py，然后访问 本机双账核对（http://127.0.0.1:8792/）。只需 Python 标准库。端口已被占用时可运行 python server.py --port 8802。使用另一个实例时需指定独立数据库，例如 --db data/review-2.sqlite3。",
    "start": 11,
    "end": 11,
    "version": "v0.2",
    "url": "https://github.com/fate788/ledger-reconciliation/blob/97649044221e9a7bde0100948efba7b617b995b3/README.md?plain=1#L11"
  },
  {
    "id": "ledger-L15",
    "project": "ledger",
    "document": "双账核对工作台",
    "text": "点击「核对样例账单」。实际输入文件位于 samples/left.csv 和 samples/right.csv。",
    "start": 15,
    "end": 15,
    "version": "v0.2",
    "url": "https://github.com/fate788/ledger-reconciliation/blob/97649044221e9a7bde0100948efba7b617b995b3/README.md?plain=1#L15"
  },
  {
    "id": "ledger-L16",
    "project": "ledger",
    "document": "双账核对工作台",
    "text": "点击「金额不符」，搜索 000127。两边 CSV 的第 4 行分别为 128.00 元和 118.00 元。切到「重复键」，可以查到需要核对的原始行号。",
    "start": 16,
    "end": 16,
    "version": "v0.2",
    "url": "https://github.com/fate788/ledger-reconciliation/blob/97649044221e9a7bde0100948efba7b617b995b3/README.md?plain=1#L16"
  },
  {
    "id": "ledger-L17",
    "project": "ledger",
    "document": "双账核对工作台",
    "text": "打开这笔差异的「复核差异」，核对原始行，填入复核人、差异原因和处理结论。演示时可记录“金额相差 10 元，原因待核实”“交运营核查渠道明细”。复核人是本机手填署名。",
    "start": 17,
    "end": 17,
    "version": "v0.2",
    "url": "https://github.com/fate788/ledger-reconciliation/blob/97649044221e9a7bde0100948efba7b617b995b3/README.md?plain=1#L17"
  },
  {
    "id": "ledger-L18",
    "project": "ledger",
    "document": "双账核对工作台",
    "text": "保存后切换至「已复核」，重新打开记录，查看当前结论或追加一版更正。两个页面同时修改时，较晚保存的一方可对照最新结论再决定是否提交。",
    "start": 18,
    "end": 18,
    "version": "v0.2",
    "url": "https://github.com/fate788/ledger-reconciliation/blob/97649044221e9a7bde0100948efba7b617b995b3/README.md?plain=1#L18"
  },
  {
    "id": "ledger-L19",
    "project": "ledger",
    "document": "双账核对工作台",
    "text": "导出完整报告可查看最近的复核结论。返回工作台并再次运行相同样例，会直接打开同一批次，已有复核历史仍可查。",
    "start": 19,
    "end": 19,
    "version": "v0.2",
    "url": "https://github.com/fate788/ledger-reconciliation/blob/97649044221e9a7bde0100948efba7b617b995b3/README.md?plain=1#L19"
  },
  {
    "id": "ledger-L23",
    "project": "ledger",
    "document": "双账核对工作台",
    "text": "表头为 业务单号,类型,金额。类型为「收款」或「退款」，金额为非负十进制元数，精确到分。上传限制为每侧 2 MiB、20,000 条数据。支持 UTF-8、带 BOM 的 UTF-8、GB18030。通过表格软件打开 CSV 时，将「业务单号」列指定为文本，可保留显示的前导零。",
    "start": 23,
    "end": 23,
    "version": "v0.2",
    "url": "https://github.com/fate788/ledger-reconciliation/blob/97649044221e9a7bde0100948efba7b617b995b3/README.md?plain=1#L23"
  },
  {
    "id": "ledger-L25",
    "project": "ledger",
    "document": "双账核对工作台",
    "text": "核对键为业务单号与类型。同一单号的收款和退款分别比较。同一键出现多次时保留双方行号，交给人工复核，适用于发现部分退款等需要更细粒度标识的情形。文件结构损坏会产生失败任务和原因。金额、单号等单行错误单列明细。「待复核」计数包括待核查的业务键和无效记录，不能直接当作损失金额或订单数。",
    "start": 25,
    "end": 25,
    "version": "v0.2",
    "url": "https://github.com/fate788/ledger-reconciliation/blob/97649044221e9a7bde0100948efba7b617b995b3/README.md?plain=1#L25"
  },
  {
    "id": "ledger-L27",
    "project": "ledger",
    "document": "双账核对工作台",
    "text": "渠道原始账单需先转换为上述三列。当前只处理同一币种的两份本地文件。工作台使用同一台电脑上的本地数据库，复核署名没有账号认证。真实渠道接入及团队分派另行规划。",
    "start": 27,
    "end": 27,
    "version": "v0.2",
    "url": "https://github.com/fate788/ledger-reconciliation/blob/97649044221e9a7bde0100948efba7b617b995b3/README.md?plain=1#L27"
  },
  {
    "id": "ledger-L31",
    "project": "ledger",
    "document": "双账核对工作台",
    "text": "engine.py 解析及验证记录，按复合键分组，给出两侧行号，导出 UTF-8 BOM 的完整 CSV。导出会转义可能触发表格公式的文本。",
    "start": 31,
    "end": 31,
    "version": "v0.2",
    "url": "https://github.com/fate788/ledger-reconciliation/blob/97649044221e9a7bde0100948efba7b617b995b3/README.md?plain=1#L31"
  },
  {
    "id": "ledger-L32",
    "project": "ledger",
    "document": "双账核对工作台",
    "text": "新版可在差异处回看相关源行的字段值。打开旧批次时保留旧版已保存的金额和来源行号。再次上传内容相同的两份 CSV，可以补齐差异原始字段，并保留原批次和复核历史。更正复核会追加版本，保留之前填写的人、原因和结论。",
    "start": 32,
    "end": 32,
    "version": "v0.2",
    "url": "https://github.com/fate788/ledger-reconciliation/blob/97649044221e9a7bde0100948efba7b617b995b3/README.md?plain=1#L32"
  },
  {
    "id": "ledger-L33",
    "project": "ledger",
    "document": "双账核对工作台",
    "text": "GET /api/health 返回服务状态、排队数、运行数与最早未完成任务的等待秒数。故障响应工作台从此端点只读探测。",
    "start": 33,
    "end": 33,
    "version": "v0.2",
    "url": "https://github.com/fate788/ledger-reconciliation/blob/97649044221e9a7bde0100948efba7b617b995b3/README.md?plain=1#L33"
  },
  {
    "id": "ledger-L34",
    "project": "ledger",
    "document": "双账核对工作台",
    "text": "server.py 只监听本机，使用 SQLite 存储异步批次。相同的两份文件按内容复用批次。重启时重新处理运行中断的任务。文件处理结束后数据库保留结果与文件名，清除任务中的源文件内容。历史供本机同一工作台使用。",
    "start": 34,
    "end": 34,
    "version": "v0.2",
    "url": "https://github.com/fate788/ledger-reconciliation/blob/97649044221e9a7bde0100948efba7b617b995b3/README.md?plain=1#L34"
  },
  {
    "id": "ledger-L35",
    "project": "ledger",
    "document": "双账核对工作台",
    "text": "运行 python -m unittest discover -v 复现核对与服务端测试。内置样例为 8 行系统订单、6 行渠道数据，结果为 3 组一致，金额不符、仅系统、仅渠道、重复键、无效记录各 1 项。",
    "start": 35,
    "end": 35,
    "version": "v0.2",
    "url": "https://github.com/fate788/ledger-reconciliation/blob/97649044221e9a7bde0100948efba7b617b995b3/README.md?plain=1#L35"
  },
  {
    "id": "ledger-L37",
    "project": "ledger",
    "document": "双账核对工作台",
    "text": "业务背景见 微信支付账单开发指引 与 美团配送对账体系实践。本版原型的核对规则及样例为独立实现。",
    "start": 37,
    "end": 37,
    "version": "v0.2",
    "url": "https://github.com/fate788/ledger-reconciliation/blob/97649044221e9a7bde0100948efba7b617b995b3/README.md?plain=1#L37"
  }
];
