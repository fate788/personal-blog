(() => {
  "use strict";

  const cases = {
    a11y: {
      category:"Web 无障碍与质量验证",audience:"前端开发、设计和测试人员",
      summary:"打开同一套预约流程的原始与修复版本。定位自动检查失败的控件，再用键盘验证预约是否顺畅。",
      images:["原始预约检查","修复版本复核"],
      process:[["定位一个问题","运行检查并选择一项发现，例如预约姓名没有关联标签。"],["验证修复前后","切换修复版，同一条规则查看新结果，实际用键盘预约。"],["记录并导出","标记走查结果，下载包含两个版本的 JSON。"]],
      testTitle:"修复后还剩几个已登记问题？",result:"5 → 0",unit:"项",resultLabel:"五项自动检查的失败数",
      resultText:"两版使用同一组检查点。键盘操作、可见焦点和预约反馈另行人工验证。"
    },
    lineage: {
      category:"数据工程与指标治理",audience:"数据模型、指标和业务看板维护人员",
      summary:"把字段变更与登记的血缘放在一起检查，核对受影响的表、指标和看板，明确每次连带影响的证据。",
      images:["变更影响与血缘总览","下游字段路径证据"],
      process:[["运行字段退役案例","检查金额字段退役的受影响字段和资产。"],["核对字段证据","选择看板或模型，查看每一段的输入、输出和依赖关系。"],["对照另两种变更","查看未引用备注与金额改类型。导入自己的血缘清单后可下载复核报告。"]],
      testTitle:"退役订单金额会影响哪些资产？",result:"6",unit:"项",resultLabel:"退役金额字段涉及的下游资产",
      resultText:"8 个下游字段使用了该列，覆盖数据表、营收指标及交易和财务看板。退役旧备注时登记清单没有下游引用。"
    },
    roster: {
      category:"运筹优化与客服运营",audience:"客服班组长及运营排班人员",
      summary:"根据技能、请假和周班次上限求解一周班表。遇到临时缺岗时复核可用人员，保留已确认的分配再重算。",
      images:["常规周班表","周日晚班缺口"],
      process:[["核对一周需求","打开常规样例，选择一班查看技能、人数和安排，将已确认的人选锁定。"],["复核请假缺口","切到请假样例，展开周日晚班，查看候选员工的技能和可用状态。"],["调整并重算","恢复专席员工周日可用，核对覆盖与锁定，再导出班表。"]],
      testTitle:"专席临时请假后，哪个班次排不满？",result:"21 → 20",unit:"席",resultLabel:"同一周的有效覆盖",
      resultText:"周日晚间原有一名可用的售后升级专席。该员工请假后缺 1 席，原有锁定仍保留。恢复可用后覆盖回到 21 席。"
    },
    logprivacy: {
      category:"应用安全与隐私",audience:"维护日志规则的开发、运维和测试人员",
      summary:"用同一批日志对照两套脱敏规则，检查敏感值的漏遮和诊断字段的误遮，再导出审查结果。",
      images:["基线规则抽检","候选规则字段复核"],
      process:[["看基线发现","打开基线规则，筛选漏遮，展开正文证据。"],["核对候选变化","切到候选规则，检查敏感值是否遮蔽、追踪 ID 是否保留。"],["导出与复跑","下载脱敏 JSONL 和审查报告。也可以本地导入自己的日志，或通过命令行复跑。"]],
      testTitle:"候选规则在样例里修复了什么？",result:"3 / 13",unit:"处",resultLabel:"基线的漏遮 / 误遮",
      resultText:"12 行带标注的合成日志中，候选规则关闭了 3 处漏遮，保留了基线误遮的 13 个诊断字段。导入批次按内置规则抽检，需人工确认。"
    },
    coldchain: {
      category:"物联网与物流调度",audience:"物流调度、现场收货与下一班交接人员",
      summary:"用三趟模拟配送回看温度、运输节点和缺失采样。看到超温时复核持续时间，遇到断报时标记证据缺口，再提交交接。",
      images:["持续超温回放","传感器断报"],
      process:[["选择一趟运输","从车次列表打开滨江配送，拖动回放观察采样和运输节点。"],["核对两类异常","追查连续超温的温度和时长，切换江北车次查看断报前后的证据。"],["保存交接","选择处置动作，填写说明。重新打开该异常，核对已保存的交接记录。"]],
      testTitle:"这次超温的观测跨度是多少？",result:"25",unit:"分钟",resultLabel:"滨江车次首末越限采样之间的时长",
      resultText:"08:40 至 09:05 的采样持续越限，最高 10.8 ℃。另一趟江北车次缺少 5 次预期采样，断报区间的温度保留未知。"
    },
    apiregression: {
      category:"接口测试与发布验收",audience:"测试开发、后端开发和发布负责人",
      summary:"在同一工作台查看基线、候选版本和放行结论。搜索用例并核对原始响应，也可用链接把具体断言发给同事。",
      images:["发布评审总览","断言与响应证据"],
      process:[["查看验收结论","对照两个版本，核对订单、退款、物流和错误响应的验收结果。"],["定位阻断证据","筛出阻断用例，在两版都返回 HTTP 200 的订单详情中检查 $.data.amountCents。"],["回归修订版本","改跑第二候选版，核对放行结论和兼容变更，再导出报告。命令行可复跑同一套验收。"]],
      testTitle:"首轮候选版有多少个用例会阻断发布？",result:"5",unit:"个",resultLabel:"10 个合成用例中的阻断结果",
      resultText:"HTTP 200 下金额从数字变为字符串，另有明细缺字段、状态码变化、取消状态变化和错误结构变化。修订版 10 个用例均通过，报告仍列出 5 项兼容变更。"
    },
    searchlab: {
      category:"电商零售与搜索排序",audience:"购物用户、搜索运营和算法工程人员",
      summary:"顾客从搜索建议找到桌面用品，对比规格后加入购物袋。运营在评测台对比基线与候选方案，定位改善、误召回和无结果的查询。",
      images:["桌面用品商店","排序对照"],
      process:[["试搜并对照型号","输入“屏幕挂灯”，查看搜索建议和商品详情。对比三款挂灯的长度与调光方式。"],["在购物袋里核对选购","把有现货的商品加入购物袋，调整数量并核对小计。演示记录保存在当前浏览器。"],["复跑排序对照","在评测台查看固定查询的标注与指标，也能输入自定义词单独对照前五位命中。"]],
      testTitle:"“屏幕挂灯”为什么能找到商品？",
      result:"0 → 3",unit:"件",resultLabel:"同义词打开时，该查询的相关商品数",
      resultText:"候选匹配到“显示器挂灯”，找到 3 件预先标为完全相关的商品。23 条合成查询里，无结果数从 17 条降到 3 条。逐条检查也发现了误召回，例如“HDMI 分线器”多出一个不相关结果。"
    },
    inventory: {
      category:"移动端与仓储作业",audience:"现场盘点员、复点员与仓库主管",
      summary:"仓员在货架边直接点货。离线保存结果，网络恢复后再补传。有分歧时，主管能核对两份原始记录及处理理由。",
      images:["移动盘点","差异复核"],
      process:[["离线记录 23 卷","以第一位盘点员身份打开 A01 包材架，给牛皮纸封箱胶带填写实点数量，断网时先保存在设备上。"],["联网补传并复点","恢复连接后同步队列。切换到第二位盘点员，独立录入 24 卷。"],["复核差异并留档","主管在同一条目查看 23、24 两份记录和 24 卷账面数，填写依据并确认 24 卷。"]],
      testTitle:"两份盘点记录如何对上？",
      result:"24",unit:"卷",resultLabel:"样例中主管复点确认的数量",
      resultText:"第一位仓员的 23 卷与第二位的 24 卷分别保留。重复补传沿用原回执，主管复核也不会改写原始记录。"
    },
    funnel: {
      category:"产品分析与行为数据",audience:"活动组织者、产品运营和数据工程人员",
      summary:"先看整体报名转化和流失最多的一环，再沿漏斗打开匿名访客的事件，核对他们走到了哪一步。",
      images:["报名转化总览","流失访客"],
      process:[["先看活动哪里流失","选择活动和转化窗口，从总体和逐步转化两个角度看转化，并按设备对照。"],["核对具体访客","打开没有达到该步骤的访客名单，进入一条记录查看这个访客的操作时间。"],["亲手报名一次","公开演练中完成一次报名，再回看板核对新增的三条事件以及变化后的漏斗。"]],
      testTitle:"报名在哪一步流失最多？",
      result:"41.9",unit:"%",resultLabel:"30 分钟窗口内的报名转化率",
      resultText:"160 人查看，99 人开始报名，67 人报名成功。选择第一处流失可打开 61 位未开始报名的匿名访客。手机端完成 31／96，桌面端完成 36／64。"
    },
    access: {
      category:"企业平台与权限治理",audience:"临时协作人员、资源负责人和审计人员",
      summary:"为具体人员开通某份内部报表的限时访问。申请、审批、回收和访问结果都能查到。",
      images:["申请人工作台","访问与回收记录"],
      process:[["提交访问申请","运营同事选择区域经营周报，说明用途和需要多久。"],["审批后核对报表","资源负责人批准后，申请人可在授权时间内打开报表。"],["到期后再次访问","推进演示时间，再打开同一份报表，查看拒绝与回收记录。"]],
      testTitle:"同一报表，三个时点的结果",
      result:"403 → 200 → 403",unit:"",resultLabel:"真实服务的 HTTP 响应",
      resultText:"审批前、授权中和到期后，使用同一账号测试同一条报表接口。到期读取返回拒绝，审计可定位相应授权与时间。"
    },
    review: {
      category:"需求质量与研发协作",audience:"需求作者、测试人员与项目负责人",
      summary:"审查同一文档的不同版本，从候选问题定位到原文，保留人工复核和修订结果。演示采用虚构服务台项目。",
      images:["项目概览","问题与原文"],
      process:[["选择需求版本","打开已有文档，确认版本和本次使用的审查规则。"],["回看原文","在问题清单中查看冲突或缺失的验收条件，分别定位关联的条款。"],["决定如何处理","核对后确认或排除问题，保留理由，继续检查修订版本。"]],
      testTitle:"一条计时冲突，能核对到哪两处？",result:"2",unit:"处原文",resultLabel:"演示文档中的同一条 SLA 冲突",
      resultText:"打开第 26 行和第 29 行。前一处要求 P1 等待时继续计时，后一处要求等待用户时暂停。两段上下文均可查看。"
    },
    manual: {
      category:"企业支持知识库",audience:"一线支持人员与手册维护者",
      summary:"给客服、IT 服务台和运营支持使用。打开工作台就能试查一条带出处的答复，再换成自己日常使用的制度或产品手册。",
      images:["快速开始","设备续借结案"],
      process:[["先试查一条答复","点击「查看演示答案」，核对门诊样例中的候补留位时长，打开对应版本的原文。"],["换成自己的手册","上传 Markdown、TXT 或粘贴正文。发布后即可在该手册的范围内查询，复制答复及出处。"],["补齐手册缺口","用设备借用示例练习登记待补问题。发布含续借时长的修订版，再引用新条款结案并导出交接清单。"]],
      testTitle:"手册修订后，旧版的依据还能找回吗？",result:"2",unit:"版",resultLabel:"示例设备借用手册的初版与修订版",
      resultText:"从登记续借问题，到发布补充条款，再到绑定新版原文结案。两次发布都保留版本和段落，历史引用可独立打开。"
    },
    clinic: {
      category: "门诊预约调度",
      audience: "门诊排班与预约窗口人员",
      summary: "查门诊余号、替就诊人跨日预约，也能凭单号核对候补顺序和留位期限。演示使用合成排班。",
      images: ["预约日程", "预约状态筛选"],
      process: [
        ["查号并登记", "看当日号源和班次，也可以在快速登记中另选日期。输入虚构就诊编号，有号直接预约，约满则进入候补。"],
        ["凭编号查进度", "在预约查询中输入就诊编号或预约单号，按办理状态缩小范围，再查这笔预约的登记、留位和确认时间。"],
        ["处理退号与停诊", "退号后为队首留位十分钟，到期会递补下一位。停诊时可选中多笔预约，一起转到仍有余号的同科班次。"]
      ],
      testTitle: "12 人同时登记最后一席，会出现几条已约？",
      result: "1", unit: "人", resultLabel: "成功占用号源，其余 11 人进入候补",
      resultText: "自动化测试使用 12 个虚构编号，并发登记同一班次的一席号源。提交结束后，在 SQLite 中核对已约和候补人数。"
    },
    campus: {
      category: "校园活动管理",
      audience: "社团组织者与参加活动的同学",
      summary: "组织者开一场活动，同学在手机上报名、签到。双方都能看清谁占了名额、谁实际到场。",
      images: ["学生报名", "现场签到"],
      process: [
        ["发布一场活动", "组织者填写时间、地点、容量及签到时段，也可以从常用活动模板起步。"],
        ["学生预订名额", "同学登录学生端报名。有人取消后，空出的名额可由下一位同学报名。"],
        ["核对到场名单", "现场展示限时二维码或六位签到码。学生提交后，组织者查看到场状态并导出名单。"]
      ],
      testTitle: "最后一个名额会超卖吗？",
      result: "8", unit: "席", resultLabel: "最终确认的报名",
      resultText: "24 个测试账号同时争 8 个名额，最终确认 8 席。另一次测试中，同一账号并发报名 12 次，仅占一席。"
    },
    ledger: {
      category: "交易数据核对",
      audience: "核对收退款的运营与财务人员",
      summary: "把订单账和渠道账放在一起核对。发现差额时，可以回到原始行查明金额，再留下复核意见。",
      images: ["批次核对", "原始行与复核"],
      process: [
        ["导入两份账单", "提交系统账与渠道账 CSV，按业务单号和收退款类型配对，逐笔核对金额。"],
        ["追查差异来源", "按差异类型筛选，打开一笔业务，同时查看两份文件的行号、原始金额和差值。"],
        ["留下复核结论", "标记处理结果，填写复核人和原因。后续更正会追加记录，相同文件重导可找回原批次。"]
      ],
      testTitle: "这 10 元差异从哪里来？",
      result: "10", unit: "元", resultLabel: "样例单号 000127 的差额",
      resultText: "两份样例的第 4 行分别为 128 元和 118 元。该批次共有 3 项一致、5 项待复核。"
    },
    incident: {
      category: "服务监测与故障响应",
      audience: "维护后台任务的开发与值班人员",
      summary: "接口能正常应答时，后台任务仍可能积压。工作台同时观察响应和队列，把异常、签收与恢复写进同一条时间线。",
      images: ["监测总览", "处置时间线"],
      process: [
        ["观察探针采样", "同时检查 HTTP 响应和最久任务等待时间。可只读观察对账服务，也可在独立服务中演练。"],
        ["签收异常事件", "持续积压会累加到已有事件中。值班人签收后，可以沿时间线查看每一次异常采样。"],
        ["确认业务恢复", "解除演练故障后继续采样。连续两次健康才关闭事件，整段处置记录可导出。"]
      ],
      testTitle: "接口正常，任务还在等吗？",
      result: "95", unit: "秒", resultLabel: "演练中最久的任务等待时间",
      resultText: "演练 #1 的接口返回 HTTP 200，但任务等待超过 45 秒阈值。3 次异常归并为 1 起事件，连续 2 次健康后关闭。"
    }
  };

  function galleryMarkup(id, record) {
    return `<figure class="pd-gallery" aria-label="产品实屏">
      <div class="pd-gallery-bar">
        <div class="pd-switches" role="group" aria-label="选择产品截图">
          ${record.images.map((label, i) => `<button type="button" class="pd-switch" data-picture="${i}" aria-pressed="${i === 0}">${label}</button>`).join("")}
        </div>
        <span class="pd-count" aria-hidden="true">1 / 2</span>
      </div>
      <button type="button" class="screenbtn pd-screen" data-screen="${images(id)}" aria-label="放大截图，${record.images[0]}">
        <img src="${images(id)}" alt="${captions[id][0]}">
        <span class="pd-enlarge" aria-hidden="true">${id === "ledger" ? "查看全图 " : ""}⤢</span>
      </button>
      ${id === "clinic" ? "" : `<figcaption class="pd-caption" aria-live="polite">${captions[id][0]}</figcaption>`}
    </figure>`;
  }

  function setupGallery(gallery, id, record) {
    const switches = gallery.querySelectorAll("[data-picture]");
    const enlarge = gallery.querySelector("[data-screen]");
    const picture = enlarge.querySelector("img");
    const caption = gallery.querySelector("figcaption");
    const count = gallery.querySelector(".pd-count");
    for (const control of switches) {
      control.addEventListener("click", () => {
        const index = Number(control.dataset.picture);
        const url = images(id, index === 1);
        for (const item of switches) item.setAttribute("aria-pressed", String(item === control));
        picture.alt = captions[id][index];
        picture.src = url;
        enlarge.dataset.screen = url;
        enlarge.setAttribute("aria-label", "放大截图，" + record.images[index]);
        if (caption) caption.textContent = picture.alt;
        count.textContent = (index + 1) + " / 2";
      });
    }
  }

  function resources(id, p) {
    const links = [
      [noteLink(id), p.note, "项目文章"],
      [deepCode(id), "查看关键代码", "定位到实现行"],
      [zip(id), "下载源码 ZIP", "项目源文件", true],
      ["downloads/" + p.run, "下载完整运行包", "本地启动", true]
    ];
    if (id === "manual") links.push([p.mainURL, "下载离线工作台 HTML", "浏览器直接打开", "手册检索室.html"]);
    if (id === "access") links.push([p.mainURL, "下载离线演练 HTML", "浏览器直接打开", "企业临时权限工作台.html"]);
    if (id === "funnel") links.push([p.mainURL, "下载离线演练 HTML", "浏览器直接打开", "产品转化分析台.html"]);
    return `<section class="pd-resources" aria-labelledby="pd-resource-title">
      <h2 id="pd-resource-title">文章与项目文件</h2>
      <ul>${links.map(([url, label, hint, download]) => `<li><a href="${url}"${typeof download === "string" ? ` download="${download}"` : download ? " download" : ""}>
        <span><small>${hint}</small><b>${label}</b></span><span class="pd-arrow" aria-hidden="true">${download ? "↓" : "→"}</span>
      </a></li>`).join("")}</ul>
      <p class="pd-requirements">${runtime[id]}</p>
    </section>`;
  }

  function serviceLinks(p) {
    const links = p.extras.filter(([label]) => label !== "同实例学生端");
    if (!localPreview || !links.length) return "";
    return `<div class="pd-service"><span>本机完整产品</span>${links.map(([label, url]) => `<a href="${url}">${label}<i aria-hidden="true">↗</i></a>`).join("")}</div>`;
  }

  function productAction(id, p) {
    if (id === "coldchain") return `<a class="pd-product" href="${p.mainURL}">打开运输追溯<span aria-hidden="true">↗</span></a><a class="pd-cta" href="${p.mainURL}&amp;trip=cc-1026">查看断报车次<span aria-hidden="true">↗</span></a>`;
    if (id === "logprivacy") return `<a class="pd-product" href="${p.mainURL}">打开抽检台<span aria-hidden="true">↗</span></a><a class="pd-cta" href="${p.mainURL}&amp;view=baseline">查看基线发现<span aria-hidden="true">↗</span></a>`;
    if (id === "roster") return `<a class="pd-product" href="${p.mainURL}">打开排班台<span aria-hidden="true">↗</span></a><a class="pd-cta" href="${p.mainURL}&amp;case=absence">查看请假缺口<span aria-hidden="true">↗</span></a>`;
    if (id === "lineage") return `<a class="pd-product" href="${p.mainURL}">打开影响分析<span aria-hidden="true">↗</span></a><a class="pd-cta" href="${p.mainURL}&amp;case=unused">查看未引用字段<span aria-hidden="true">↗</span></a>`;
    if (id === "a11y") return `<a class="pd-product" href="${p.mainURL}">打开走查台<span aria-hidden="true">↗</span></a><a class="pd-cta" href="${p.mainURL}&amp;view=fixed">体验修复版<span aria-hidden="true">↗</span></a>`;
    if (id === "apiregression") return `<a class="pd-product" href="${p.mainURL}">打开验收台<span aria-hidden="true">↗</span></a><a class="pd-cta" href="${p.mainURL}&amp;candidate=candidate-b">运行修订版<span aria-hidden="true">↗</span></a>`;
    if (id === "manual") return `<a class="pd-product" href="${p.mainURL}">打开支持工作台<span aria-hidden="true">↗</span></a>`;
    if (id === "review") return `<a class="pd-product" href="${p.mainURL}">打开演示工作台<span aria-hidden="true">↗</span></a>`;
    if (id === "access") return `<a class="pd-product" href="${p.mainURL}">试用临时权限<span aria-hidden="true">↗</span></a>`;
    if (id === "funnel") return `<a class="pd-product" href="${p.mainURL}">打开分析工作台<span aria-hidden="true">↗</span></a>`;
    if (id === "inventory") return `<a class="pd-product" href="${p.mainURL}">打开盘点工作台<span aria-hidden="true">↗</span></a>`;
    if (id === "searchlab") return `<a class="pd-product" href="${p.mainURL}">试搜商品<span aria-hidden="true">↗</span></a><a class="pd-cta" href="${p.evaluationURL}">打开评测台<span aria-hidden="true">↗</span></a>`;
    if (!localPreview) return "";
    const url = id === "campus" ? p.extras.find(([label]) => label === "同实例学生端")[1] : p.mainURL;
    const label = id === "campus" ? "打开学生端" : id === "manual" ? "打开检索室" : "打开工作台";
    return `<a class="pd-product" href="${url}">${label}<span aria-hidden="true">↗</span></a>`;
  }

  window.renderProjectDetail = function (id, p, view) {
    const record = cases[id];
    host.innerHTML = `<article class="pd-case pd-${id}">
      <nav class="pd-crumb" aria-label="面包屑"><a href="#home">首页</a><span aria-hidden="true">/</span><a href="#projects">作品</a><span aria-hidden="true">/</span><span aria-current="page">${p.name}</span></nav>
      <div class="pd-lead">
        <header class="pd-intro">
          <p class="pd-topic"><span>${record.category}</span><span>${p.version}</span></p>
          <h1>${p.name}</h1>
          <p class="pd-summary">${record.summary}</p>
          <dl class="pd-facts"><div><dt>使用者</dt><dd>${record.audience}</dd></div><div><dt>技术栈</dt><dd>${p.stack}</dd></div>
            <div><dt>GitHub</dt><dd><a class="repo-link" href="${window.blogGitHub.repositories[id]}">${window.blogGitHub.repositories[id].split("/").slice(-2).join(" / ")}</a></dd></div>
            ${id==="funnel"?'<div><dt>接入项目</dt><dd><a href="#project/campus">校园场务</a></dd></div>':""}
            ${id==="campus"?'<div><dt>报名分析</dt><dd><a href="#project/funnel">产品转化分析台</a></dd></div>':""}
          </dl>
          <div class="pd-actions">${productAction(id, p)}${["access","funnel","inventory","searchlab","apiregression","coldchain","logprivacy","roster","lineage","a11y"].includes(id)?"":`<a class="pd-cta" href="${sampleLink(id)}">体验交互样例<span aria-hidden="true">↓</span></a>`}<a class="pd-read" href="${source(id)}">在线读源码<span aria-hidden="true">↗</span></a></div>
        </header>
        ${galleryMarkup(id, record)}
      </div>
      <section class="pd-process" aria-labelledby="pd-process-title"><h2 id="pd-process-title">使用流程</h2>
        <ol>${record.process.map(([title, text], i) => `<li><div class="pd-step-title"><span aria-hidden="true">0${i + 1}</span><h3>${title}</h3></div><p>${text}</p></li>`).join("")}</ol>
      </section>
      <div class="pd-explore">
        <section class="pd-sample" id="sample" aria-labelledby="pd-sample-heading"><h2 id="pd-sample-heading">交互样例</h2><div id="sample-slot"></div>${serviceLinks(p)}</section>
        <aside class="pd-evidence" aria-labelledby="pd-evidence-title">
          <p class="pd-label">${["funnel","inventory","searchlab","apiregression","coldchain","logprivacy","roster","lineage","a11y"].includes(id)?"合成样例":"本机验证记录"}</p><h2 id="pd-evidence-title">${record.testTitle}</h2>
          <div class="pd-measure"><strong>${record.result}</strong><span>${record.unit}</span></div>
          <p class="pd-measure-label">${record.resultLabel}</p><p class="pd-evidence-text">${record.resultText}</p>
        </aside>
      </div>
      <div class="pd-bottom">
        <section class="pd-practice" aria-labelledby="pd-practice-title"><h2 id="pd-practice-title">技术实践</h2>
          <dl>${p.roles.map(role => `<div><dt><a href="${routeTo(role)}">${roleNames[role]}<i aria-hidden="true">↗</i></a></dt><dd>${p.proof[role]}</dd></div>`).join("")}</dl>
        </section>
        ${resources(id, p)}
      </div>
    </article>`;
    setupGallery(host.querySelector(".pd-gallery"), id, record);
    window.mountProjectSample(document.getElementById("sample-slot"), id);
    if (view === "sample") document.getElementById("sample").scrollIntoView();
  };
})();
