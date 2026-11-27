(() => {
  "use strict";

  const cases = {
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
    return `<section class="pd-resources" aria-labelledby="pd-resource-title">
      <h2 id="pd-resource-title">文章与项目文件</h2>
      <ul>${links.map(([url, label, hint, download]) => `<li><a href="${url}"${download ? " download" : ""}>
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
    if (!localPreview) return "";
    const url = id === "campus" ? p.extras.find(([label]) => label === "同实例学生端")[1] : p.mainURL;
    const label = id === "campus" ? "打开学生端" : "打开工作台";
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
          </dl>
          <div class="pd-actions">${productAction(id, p)}<a class="pd-cta" href="${sampleLink(id)}">体验交互样例<span aria-hidden="true">↓</span></a><a class="pd-read" href="${source(id)}">在线读源码<span aria-hidden="true">↗</span></a></div>
        </header>
        ${galleryMarkup(id, record)}
      </div>
      <section class="pd-process" aria-labelledby="pd-process-title"><h2 id="pd-process-title">使用流程</h2>
        <ol>${record.process.map(([title, text], i) => `<li><div class="pd-step-title"><span aria-hidden="true">0${i + 1}</span><h3>${title}</h3></div><p>${text}</p></li>`).join("")}</ol>
      </section>
      <div class="pd-explore">
        <section class="pd-sample" id="sample" aria-labelledby="pd-sample-heading"><h2 id="pd-sample-heading">交互样例</h2><div id="sample-slot"></div>${serviceLinks(p)}</section>
        <aside class="pd-evidence" aria-labelledby="pd-evidence-title">
          <p class="pd-label">本机验证记录</p><h2 id="pd-evidence-title">${record.testTitle}</h2>
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
