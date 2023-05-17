// onClick={() => {
//     Swal.fire({
//       title: '請輸入您的股票猜測價格',
//       showCancelButton: true,
//       html:
//         '<input type="radio" id="up" name="trend" value="上漲">' +
//         '<label for="up" style="margin-right:10px;">上漲</label>' +
//         '<input type="radio" id="down" name="trend" value="下跌">' +
//         '<label for="down">下跌</label>' +
//         '<br><br>' +
//         '<input type="text" id="guessmoney" style="border-radius:5px" disabled value="0.01" oninput="this.disabled = false">' +
//         '<br>' +
//         '<br>' +
//         '<input value type="text" id="guess" style="border-radius:5px" placeholder="請輸入您的猜測">',
//       focusConfirm: false,
//       preConfirm: () => {
//         const trend = document.querySelector('input[name="trend"]:checked');
//         const guess = document.getElementById('guess').value;
//         const guessmoney = document.getElementById('guessmoney').value;
//         if (!trend) {
//           Swal.showValidationMessage('請輸入您的股票猜測價格及漲跌');
//           return false;
//         } else if (guess.trim() === '') {
//           Swal.showValidationMessage('請輸入您的猜測');
//           return false;
//         }
//         return { trend: trend.value, guess: guess, guessmoney: guessmoney };
//       }
//     }).then((result) => {
//       if (result.isConfirmed) {
//         Swal.fire({
//           title: '確認您的猜測',
//           text: `您的猜測為：${result.value.trend} ${result.value.guess}，
//                  下注金額為：${result.value.guessmoney} \r\n 確定要送出嗎？`,
//           icon: 'warning',
//           showCancelButton: true,
//           confirmButtonText: '確認',
//           cancelButtonText: '取消',
//         }).then((result) => {
//           if (result.isConfirmed) {
//             Swal.fire({
//               title: '輸入值',
//               text: `您的猜測為： ${result.value.guess} 收盤指數 ${result.value.trend}`,
//               icon: 'success',
//             });
//           }
//         });
//       }
//     });
//   }}