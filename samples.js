(function () {
  "use strict";

  const temporaryReviews = new Map();

  function tag(name, className, text) {
    const element = document.createElement(name);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function button(text, className) {
    const element = tag("button", className, text);
    element.type = "button";
    return element;
  }

  function actions(options, select, label) {
    const group = tag("div", "pbs-options");
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", label);
    const buttons = options.map((text, index) => {
      const control = button(text, "pbs-option");
      control.addEventListener("click", () => select(index));
      group.append(control);
      return control;
    });
    return { group, mark: index => buttons.forEach((control, i) =>
      control.setAttribute("aria-pressed", String(i === index))) };
  }

  function title(root, name, description) {
    root.append(tag("h3", "pbs-title", name), tag("p", "pbs-intro", description));
  }

  function resultBox() {
    const box = tag("div", "pbs-result");
    box.setAttribute("aria-live", "polite");
    box.setAttribute("aria-atomic", "true");
    return box;
  }

  function campus(root) {
    title(root, "这个时刻能签到吗？", "合成场次在 19:00 开始，持续 60 分钟。假设学生已报名，组织者已开启现场签到，且学生使用有效签到码。");
    const timeline = tag("ol", "pbs-clock");
    [["18:45", "签到开放"], ["19:00", "活动开始"], ["19:30", "签到截止"], ["20:00", "活动结束"]].forEach(([time, label]) => {
      const item = tag("li");
      item.append(tag("time", "", time), tag("span", "", label));
      timeline.append(item);
    });
    const minutes = [18 * 60 + 44, 18 * 60 + 45, 19 * 60 + 15, 19 * 60 + 30, 19 * 60 + 31];
    const times = ["18:44", "18:45", "19:15", "19:30", "19:31"];
    const output = resultBox();
    const options = actions(times, update, "选择模拟签到时间");
    root.append(timeline, tag("p", "pbs-label", "选择模拟签到时间"), options.group, output);
    function update(index) {
      options.mark(index);
      const minute = minutes[index];
      let verdict, reason;
      if (minute < 18 * 60 + 45) {
        verdict = "签到尚未开放";
        reason = "本场从 18:45 起接受签到。";
      } else if (minute >= 19 * 60 + 30) {
        verdict = "已过签到时段";
        reason = "19:30 起停止接收签到，活动仍会继续到 20:00。";
      } else {
        verdict = "处于可签到时段";
        reason = "开放时刻算在窗口内，截止时刻起停止接收。";
      }
      output.replaceChildren(tag("strong", "", times[index] + " · " + verdict), tag("p", "", reason));
    }
    update(1);
  }

  const bills = [
    { order: "000127", kind: "收款", code: "金额不符", left: [[4, "128.00"]], right: [[4, "118.00"]],
      finding: "系统侧比渠道侧多 10.00 元。业务单号与收款类型一致，可回查第 4 行核实原因。" },
    { order: "000130", kind: "收款", code: "重复键", left: [[6, "88.00"], [7, "88.00"]], right: [[6, "88.00"]],
      finding: "系统有两行相同的业务键，渠道只有一行。应逐笔核实，这两行可能代表不同明细。" },
    { order: "000129", kind: "退款", code: "仅渠道", left: [], right: [[5, "16.00"]],
      finding: "渠道列有 16.00 元退款，系统账里找不到同单号、同类型的记录。" }
  ];

  function billSide(label, rows) {
    const side = tag("div", "pbs-side");
    side.append(tag("h4", "", label));
    if (!rows.length) side.append(tag("p", "pbs-no-row", "无对应记录"));
    for (const [line, amount] of rows) {
      const entry = tag("p", "pbs-row");
      entry.append(tag("span", "", "第 " + line + " 行"), tag("strong", "", amount + " 元"));
      side.append(entry);
    }
    return side;
  }

  function ledger(root) {
    title(root, "从差异查回原始账单", "选取随包合成账单中的一笔，核对系统与渠道金额。复核说明暂存在本页，刷新即清空。");
    const selected = actions(bills.map(record => record.code), select, "选择差异类型");
    const evidence = resultBox();
    const form = tag("form", "pbs-review");
    const label = tag("label", "pbs-field");
    const note = tag("textarea");
    note.rows = 2;
    note.required = true;
    note.maxLength = 240;
    note.placeholder = "写下你的判断或下一步核查事项";
    label.append(tag("span", "pbs-label", "复核说明"), note);
    const save = button("保存本页说明", "pbs-submit");
    save.type = "submit";
    const history = tag("div", "pbs-history");
    history.setAttribute("aria-live", "polite");
    const drafts = new Map();
    let active = null;
    form.append(label, save);
    root.append(selected.group, evidence, form, history);
    function showReviews() {
      const reviews = temporaryReviews.get(active.order) || [];
      history.replaceChildren();
      if (!reviews.length) return;
      history.append(tag("strong", "pbs-label", "本页复核记录"));
      const list = tag("ol");
      for (const text of reviews) list.append(tag("li", "", text));
      history.append(list);
    }
    function select(index) {
      if (active) drafts.set(active.order, note.value);
      selected.mark(index);
      active = bills[index];
      note.value = drafts.get(active.order) || "";
      note.setCustomValidity("");
      const sides = tag("div", "pbs-sides");
      sides.append(billSide("系统账单", active.left), billSide("渠道账单", active.right));
      evidence.replaceChildren(tag("strong", "", active.order + " · " + active.kind), sides, tag("p", "", active.finding));
      showReviews();
    }
    note.addEventListener("input", () => note.setCustomValidity(""));
    form.addEventListener("submit", event => {
      event.preventDefault();
      const text = note.value.trim();
      if (!text) {
        note.setCustomValidity("请先填写复核说明。");
        note.reportValidity();
        return;
      }
      const reviews = temporaryReviews.get(active.order) || [];
      reviews.push(text);
      temporaryReviews.set(active.order, reviews);
      note.value = "";
      drafts.delete(active.order);
      showReviews();
    });
    select(0);
  }

  const timeline = [
    ["10:21:21.344", "发现积压", "健康接口返回 HTTP 200。队列中 4 项排队、1 项运行，最早未完成任务已等待 95 秒，触发 45 秒阈值。"],
    ["10:21:24.446", "值班签收", "值班人确认收到告警。事件继续保持待恢复状态，签收本身不会消除积压。"],
    ["10:21:25.750", "解除故障", "演练条件已解除，监控开始等待探测结果。此时事件仍然打开。"],
    ["10:21:25.764", "首次正常", "HTTP 200，耗时 15 毫秒，排队和运行均为 0。收到第一次健康采样，继续观察。"],
    ["10:21:27.721", "确认恢复", "连续两次健康采样，排队和运行均为 0，事件关闭。这次演练累计 3 次异常采样，归入同一起事件。"]
  ];

  function incident(root) {
    title(root, "回放一次积压告警", "隔离演练 #1 的已录事件。选取时间点，查看当时的探测与处置记录。以下时间均为北京时间。");
    const output = resultBox();
    const steps = actions(timeline.map(row => row[1]), select, "选择演练记录");
    root.append(steps.group, output);
    function select(index) {
      steps.mark(index);
      const [at, name, body] = timeline[index];
      output.replaceChildren(tag("time", "pbs-record-time", "2026-11-27  " + at), tag("strong", "", name), tag("p", "", body));
    }
    select(0);
  }

  function clinic(root) {
    title(root, "把释放的一席分给谁？", "离线模拟 · R001 已约，R003 和 R004 依次候补。取消原预约后，可以选择按时确认，或模拟十分钟的确认期限到期。");
    const result = resultBox();
    const controls = tag("div", "pbs-options pbs-clinic-actions");
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", "模拟候补操作");
    const release = button("取消 R001 的预约", "pbs-option");
    const confirm = button("确认当前留位", "pbs-option");
    const advance = button("推进 10 分钟", "pbs-option");
    const restart = button("重新模拟", "pbs-option");
    controls.append(release, confirm, advance, restart);
    root.append(result, controls);
    let booked, held, queue, elapsed;
    const clock = () => {
      const minute = 8 * 60 + 40 + elapsed;
      return String(Math.floor(minute / 60)).padStart(2, "0") + ":" + String(minute % 60).padStart(2, "0");
    };
    function update(message) {
      const status = booked ? booked + " 已约" : held ? "为 " + held + " 留位" : "余位 1 席";
      result.replaceChildren(tag("strong", "", clock() + " · " + status),
        tag("p", "", message), tag("p", "", "候补队列　" + (queue.join(" → ") || "无人候补")));
      release.hidden = booked !== "R001";
      confirm.hidden = advance.hidden = !held;
      restart.hidden = booked === "R001";
    }
    function reset() {
      booked = "R001"; held = ""; queue = ["R003", "R004"]; elapsed = 0;
      update("当前这一席由 R001 占用。");
    }
    release.addEventListener("click", () => {
      booked = "";
      held = queue.shift();
      update(held + " 获得十分钟确认时间，这一席已计入占用。");
      confirm.focus({preventScroll:true});
    });
    confirm.addEventListener("click", () => {
      booked = held; held = "";
      update("确认成功，原留位转为正式预约。");
      restart.focus({preventScroll:true});
    });
    advance.addEventListener("click", () => {
      elapsed += 10;
      const expired = held;
      held = queue.shift() || "";
      update(expired + " 的留位到期。" + (held ? "轮到 " + held + " 确认。" : "候补队列已清空，号源可重新安排。"));
      if (!held) restart.focus({preventScroll:true});
    });
    restart.addEventListener("click", () => { reset(); release.focus({preventScroll:true}); });
    reset();
  }

  const samples = { campus, ledger, incident, clinic };
  window.mountProjectSample = function (element, projectId) {
    if (!element) return;
    const root = tag("div", "pbs-sample");
    const mount = Object.hasOwn(samples, projectId) ? samples[projectId] : null;
    element.replaceChildren();
    if (!mount) return;
    element.append(root);
    mount(root);
  };
})();
