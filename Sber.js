(function() {
    var CARRY = { spear:25, sword:15, axe:10, archer:10, light:80, marcher:50, heavy:50, ram:5, catapult:5, knight:100 };
    var NAMES = { spear:'Oštěpař', sword:'Mečíř', axe:'Sekerník', archer:'Lučišník', light:'Lehká jízda', marcher:'Střelec na koni', heavy:'Těžká jízda', ram:'Beran', catapult:'Katapult', knight:'Šlechtic' };

    var existing = document.getElementById('tw_sber_panel');
    if (existing) { existing.remove(); return; }

    var panel = document.createElement('div');
    panel.id = 'tw_sber_panel';
    panel.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#231a0a;border:2px solid #c8962a;border-radius:8px;padding:16px;z-index:99999;color:#e8d9b8;font-family:Arial,sans-serif;width:320px;max-height:90vh;overflow-y:auto;box-shadow:0 4px 20px rgba(0,0,0,0.8)';

    var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">';
    html += '<b style="color:#e8b84b;font-size:15px">⚔ Kalkulátor Sběru</b>';
    html += '<button id="tw_close" style="background:#5a3e1b;color:#e8d9b8;border:none;border-radius:4px;padding:3px 8px;cursor:pointer;font-size:14px">✕</button></div>';

    html += '<table style="width:100%;font-size:12px;border-collapse:collapse">';
    for (var k in NAMES) {
        html += '<tr><td style="padding:3px 4px;color:#9a8060">' + NAMES[k] + '</td>';
        html += '<td style="padding:3px 4px"><input id="tw_' + k + '" type="number" min="0" value="0" style="width:80px;background:#1a1208;color:#e8d9b8;border:1px solid #5a3e1b;border-radius:3px;padding:3px 5px"></td></tr>';
    }
    html += '</table>';

    html += '<div style="margin:10px 0;font-size:12px">Sloty: <select id="tw_slots" style="background:#1a1208;color:#e8d9b8;border:1px solid #c8962a;border-radius:3px;padding:3px 6px">';
    html += '<option value="1">1 slot</option><option value="2" selected>2 sloty</option><option value="3">3 sloty</option><option value="4">4 sloty</option></select></div>';

    html += '<button id="tw_calc" style="width:100%;background:#c8962a;color:#1a1208;border:none;border-radius:4px;padding:9px;font-weight:bold;cursor:pointer;font-size:13px">Spočítat</button>';
    html += '<div id="tw_result" style="margin-top:10px"></div>';

    panel.innerHTML = html;
    document.body.appendChild(panel);

    document.getElementById('tw_close').onclick = function() { panel.remove(); };

    document.getElementById('tw_calc').onclick = function() {
        var slots = parseInt(document.getElementById('tw_slots').value);
        var troops = {};
        var totalCap = 0;

        for (var k in CARRY) {
            var el = document.getElementById('tw_' + k);
            if (!el) continue;
            var v = parseInt(el.value) || 0;
            if (v > 0) { troops[k] = v; totalCap += v * CARRY[k]; }
        }

        if (totalCap === 0) {
            document.getElementById('tw_result').innerHTML = '<p style="color:#e05040;font-size:12px">Zadej alespoň nějaká vojska!</p>';
            return;
        }

        var keys = Object.keys(troops);
        var out = '<hr style="border-color:#5a3e1b;margin:8px 0">';
        out += '<div style="text-align:center;color:#e8b84b;font-weight:bold;margin-bottom:8px">Celkem: ' + Math.round(totalCap).toLocaleString('cs-CZ') + ' surovin</div>';

        for (var i = 0; i < slots; i++) {
            var slotCap = 0;
            var parts = [];
            for (var j = 0; j < keys.length; j++) {
                var kk = keys[j];
                var cnt = Math.floor(troops[kk] / slots) + (i < troops[kk] % slots ? 1 : 0);
                if (cnt > 0) { slotCap += cnt * CARRY[kk]; parts.push(NAMES[kk] + ': ' + cnt); }
            }
            var mins = Math.max(30, slotCap / 40);
            var h = Math.floor(mins / 60);
            var m = Math.floor(mins % 60);
            var timeStr = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':00';

            out += '<div style="margin-bottom:6px;padding:7px;border:1px solid #5a3e1b;border-radius:4px;background:#1a1208">';
            out += '<b style="color:#e8b84b">Slot ' + (i+1) + ' · ⏱ ' + timeStr + '</b><br>';
            out += '<span style="font-size:11px;color:#9a8060">' + parts.join(', ') + '<br>Kapacita: ' + Math.round(slotCap).toLocaleString('cs-CZ') + ' surovin</span></div>';
        }

        document.getElementById('tw_result').innerHTML = out;
    };
})();
