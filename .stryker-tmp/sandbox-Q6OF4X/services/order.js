// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { nanoid } from 'nanoid';
import Order from '../models/Order.js';
import Dish from '../models/Dish.js';
const defaultEmployee = stryMutAct_9fa48("0") ? "" : (stryCov_9fa48("0"), 'E101');
const getAllHistory = async () => {
  if (stryMutAct_9fa48("1")) {
    {}
  } else {
    stryCov_9fa48("1");
    try {
      if (stryMutAct_9fa48("2")) {
        {}
      } else {
        stryCov_9fa48("2");
        return await (stryMutAct_9fa48("3") ? Order.find().populate('items.menu_id', 'dishName price') : (stryCov_9fa48("3"), Order.find().populate(stryMutAct_9fa48("4") ? "" : (stryCov_9fa48("4"), 'items.menu_id'), stryMutAct_9fa48("5") ? "" : (stryCov_9fa48("5"), 'dishName price')).sort(stryMutAct_9fa48("6") ? {} : (stryCov_9fa48("6"), {
          createdAt: stryMutAct_9fa48("7") ? +1 : (stryCov_9fa48("7"), -1)
        }))));
      }
    } catch (error) {
      if (stryMutAct_9fa48("8")) {
        {}
      } else {
        stryCov_9fa48("8");
        console.error(stryMutAct_9fa48("9") ? "" : (stryCov_9fa48("9"), 'Помилка у сервісі getAllHistory:'), error);
        throw new Error(stryMutAct_9fa48("10") ? "" : (stryCov_9fa48("10"), 'Не вдалося отримати історію замовлень'));
      }
    }
  }
};
const getPopularDishes = async () => {
  if (stryMutAct_9fa48("11")) {
    {}
  } else {
    stryCov_9fa48("11");
    try {
      if (stryMutAct_9fa48("12")) {
        {}
      } else {
        stryCov_9fa48("12");
        return await Order.aggregate(stryMutAct_9fa48("13") ? [] : (stryCov_9fa48("13"), [stryMutAct_9fa48("14") ? {} : (stryCov_9fa48("14"), {
          $unwind: stryMutAct_9fa48("15") ? "" : (stryCov_9fa48("15"), '$items')
        }), stryMutAct_9fa48("16") ? {} : (stryCov_9fa48("16"), {
          $group: stryMutAct_9fa48("17") ? {} : (stryCov_9fa48("17"), {
            _id: stryMutAct_9fa48("18") ? "" : (stryCov_9fa48("18"), '$items.menu_id'),
            totalQuantity: stryMutAct_9fa48("19") ? {} : (stryCov_9fa48("19"), {
              $sum: stryMutAct_9fa48("20") ? "" : (stryCov_9fa48("20"), '$items.quantity')
            })
          })
        }), stryMutAct_9fa48("21") ? {} : (stryCov_9fa48("21"), {
          $sort: stryMutAct_9fa48("22") ? {} : (stryCov_9fa48("22"), {
            totalQuantity: stryMutAct_9fa48("23") ? +1 : (stryCov_9fa48("23"), -1)
          })
        }), stryMutAct_9fa48("24") ? {} : (stryCov_9fa48("24"), {
          $lookup: stryMutAct_9fa48("25") ? {} : (stryCov_9fa48("25"), {
            from: stryMutAct_9fa48("26") ? "" : (stryCov_9fa48("26"), 'dishes'),
            localField: stryMutAct_9fa48("27") ? "" : (stryCov_9fa48("27"), '_id'),
            foreignField: stryMutAct_9fa48("28") ? "" : (stryCov_9fa48("28"), '_id'),
            as: stryMutAct_9fa48("29") ? "" : (stryCov_9fa48("29"), 'dishDetails')
          })
        }), stryMutAct_9fa48("30") ? {} : (stryCov_9fa48("30"), {
          $unwind: stryMutAct_9fa48("31") ? "" : (stryCov_9fa48("31"), '$dishDetails')
        }), stryMutAct_9fa48("32") ? {} : (stryCov_9fa48("32"), {
          $project: stryMutAct_9fa48("33") ? {} : (stryCov_9fa48("33"), {
            _id: 0,
            menu_id: stryMutAct_9fa48("34") ? "" : (stryCov_9fa48("34"), '$_id'),
            dishName: stryMutAct_9fa48("35") ? "" : (stryCov_9fa48("35"), '$dishDetails.dishName'),
            totalQuantity: stryMutAct_9fa48("36") ? "" : (stryCov_9fa48("36"), '$totalQuantity')
          })
        })]));
      }
    } catch (error) {
      if (stryMutAct_9fa48("37")) {
        {}
      } else {
        stryCov_9fa48("37");
        console.error(stryMutAct_9fa48("38") ? "" : (stryCov_9fa48("38"), 'Помилка у сервісі getPopularDishes:'), error);
        throw new Error(stryMutAct_9fa48("39") ? "" : (stryCov_9fa48("39"), 'Не вдалося розрахувати популярні страви'));
      }
    }
  }
};
const getAllActiveOrders = async () => {
  if (stryMutAct_9fa48("40")) {
    {}
  } else {
    stryCov_9fa48("40");
    try {
      if (stryMutAct_9fa48("41")) {
        {}
      } else {
        stryCov_9fa48("41");
        return await (stryMutAct_9fa48("42") ? Order.find({
          status: 'active'
        }).populate('items.menu_id', 'dishName price') : (stryCov_9fa48("42"), Order.find(stryMutAct_9fa48("43") ? {} : (stryCov_9fa48("43"), {
          status: stryMutAct_9fa48("44") ? "" : (stryCov_9fa48("44"), 'active')
        })).populate(stryMutAct_9fa48("45") ? "" : (stryCov_9fa48("45"), 'items.menu_id'), stryMutAct_9fa48("46") ? "" : (stryCov_9fa48("46"), 'dishName price')).sort(stryMutAct_9fa48("47") ? {} : (stryCov_9fa48("47"), {
          createdAt: stryMutAct_9fa48("48") ? +1 : (stryCov_9fa48("48"), -1)
        }))));
      }
    } catch (error) {
      if (stryMutAct_9fa48("49")) {
        {}
      } else {
        stryCov_9fa48("49");
        console.error(stryMutAct_9fa48("50") ? "" : (stryCov_9fa48("50"), 'Помилка у сервісі getAllActiveOrders:'), error);
        throw new Error(stryMutAct_9fa48("51") ? "" : (stryCov_9fa48("51"), 'Не вдалося отримати активні замовлення'));
      }
    }
  }
};
const createOrder = async orderBody => {
  if (stryMutAct_9fa48("52")) {
    {}
  } else {
    stryCov_9fa48("52");
    const {
      customerName,
      items
    } = orderBody;
    if (stryMutAct_9fa48("55") ? (!customerName || !items) && items.length === 0 : stryMutAct_9fa48("54") ? false : stryMutAct_9fa48("53") ? true : (stryCov_9fa48("53", "54", "55"), (stryMutAct_9fa48("57") ? !customerName && !items : stryMutAct_9fa48("56") ? false : (stryCov_9fa48("56", "57"), (stryMutAct_9fa48("58") ? customerName : (stryCov_9fa48("58"), !customerName)) || (stryMutAct_9fa48("59") ? items : (stryCov_9fa48("59"), !items)))) || (stryMutAct_9fa48("61") ? items.length !== 0 : stryMutAct_9fa48("60") ? false : (stryCov_9fa48("60", "61"), items.length === 0)))) {
      if (stryMutAct_9fa48("62")) {
        {}
      } else {
        stryCov_9fa48("62");
        const err = new Error(stryMutAct_9fa48("63") ? "" : (stryCov_9fa48("63"), 'Потрібні ім’я клієнта та позиції замовлення.'));
        err.statusCode = 400;
        throw err;
      }
    }
    const menuIds = items.map(stryMutAct_9fa48("64") ? () => undefined : (stryCov_9fa48("64"), item => item.menu_id));
    const menuItems = await Dish.find(stryMutAct_9fa48("65") ? {} : (stryCov_9fa48("65"), {
      _id: stryMutAct_9fa48("66") ? {} : (stryCov_9fa48("66"), {
        $in: menuIds
      })
    }));
    const menuMap = new Map(menuItems.map(stryMutAct_9fa48("67") ? () => undefined : (stryCov_9fa48("67"), dish => stryMutAct_9fa48("68") ? [] : (stryCov_9fa48("68"), [dish._id, dish]))));
    let totalPrice = 0;
    const orderItems = stryMutAct_9fa48("69") ? ["Stryker was here"] : (stryCov_9fa48("69"), []);
    for (const item of items) {
      if (stryMutAct_9fa48("70")) {
        {}
      } else {
        stryCov_9fa48("70");
        const menuItem = menuMap.get(item.menu_id);
        if (stryMutAct_9fa48("73") ? false : stryMutAct_9fa48("72") ? true : stryMutAct_9fa48("71") ? menuItem : (stryCov_9fa48("71", "72", "73"), !menuItem)) {
          if (stryMutAct_9fa48("74")) {
            {}
          } else {
            stryCov_9fa48("74");
            const err = new Error(stryMutAct_9fa48("75") ? `` : (stryCov_9fa48("75"), `Страва з ID ${item.menu_id} не знайдена.`));
            err.statusCode = 404;
            throw err;
          }
        }
        stryMutAct_9fa48("76") ? totalPrice -= menuItem.price * item.quantity : (stryCov_9fa48("76"), totalPrice += stryMutAct_9fa48("77") ? menuItem.price / item.quantity : (stryCov_9fa48("77"), menuItem.price * item.quantity));
        orderItems.push(stryMutAct_9fa48("78") ? {} : (stryCov_9fa48("78"), {
          menu_id: item.menu_id,
          quantity: item.quantity
        }));
      }
    }
    const newOrder = stryMutAct_9fa48("79") ? {} : (stryCov_9fa48("79"), {
      _id: nanoid(),
      customerName,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      status: stryMutAct_9fa48("80") ? "" : (stryCov_9fa48("80"), 'active'),
      employee_id: defaultEmployee,
      items: orderItems
    });
    return Order.create(newOrder);
  }
};
const updateOrderStatus = async (orderId, newStatus) => {
  if (stryMutAct_9fa48("81")) {
    {}
  } else {
    stryCov_9fa48("81");
    if (stryMutAct_9fa48("84") ? !newStatus && !['active', 'completed'].includes(newStatus) : stryMutAct_9fa48("83") ? false : stryMutAct_9fa48("82") ? true : (stryCov_9fa48("82", "83", "84"), (stryMutAct_9fa48("85") ? newStatus : (stryCov_9fa48("85"), !newStatus)) || (stryMutAct_9fa48("86") ? ['active', 'completed'].includes(newStatus) : (stryCov_9fa48("86"), !(stryMutAct_9fa48("87") ? [] : (stryCov_9fa48("87"), [stryMutAct_9fa48("88") ? "" : (stryCov_9fa48("88"), 'active'), stryMutAct_9fa48("89") ? "" : (stryCov_9fa48("89"), 'completed')])).includes(newStatus))))) {
      if (stryMutAct_9fa48("90")) {
        {}
      } else {
        stryCov_9fa48("90");
        const err = new Error(stryMutAct_9fa48("91") ? "" : (stryCov_9fa48("91"), 'Недійсний статус. Можливі: "active", "completed".'));
        err.statusCode = 400;
        throw err;
      }
    }
    const updatedOrder = await Order.findByIdAndUpdate(orderId, stryMutAct_9fa48("92") ? {} : (stryCov_9fa48("92"), {
      status: newStatus
    }), stryMutAct_9fa48("93") ? {} : (stryCov_9fa48("93"), {
      new: stryMutAct_9fa48("94") ? false : (stryCov_9fa48("94"), true)
    }));
    if (stryMutAct_9fa48("97") ? false : stryMutAct_9fa48("96") ? true : stryMutAct_9fa48("95") ? updatedOrder : (stryCov_9fa48("95", "96", "97"), !updatedOrder)) {
      if (stryMutAct_9fa48("98")) {
        {}
      } else {
        stryCov_9fa48("98");
        const err = new Error(stryMutAct_9fa48("99") ? "" : (stryCov_9fa48("99"), 'Активне замовлення не знайдено.'));
        err.statusCode = 404;
        throw err;
      }
    }
    return updatedOrder;
  }
};
const deleteOrder = async orderId => {
  if (stryMutAct_9fa48("100")) {
    {}
  } else {
    stryCov_9fa48("100");
    const deletedOrder = await Order.findOneAndDelete(stryMutAct_9fa48("101") ? {} : (stryCov_9fa48("101"), {
      _id: orderId,
      status: stryMutAct_9fa48("102") ? "" : (stryCov_9fa48("102"), 'completed')
    }));
    if (stryMutAct_9fa48("105") ? false : stryMutAct_9fa48("104") ? true : stryMutAct_9fa48("103") ? deletedOrder : (stryCov_9fa48("103", "104", "105"), !deletedOrder)) {
      if (stryMutAct_9fa48("106")) {
        {}
      } else {
        stryCov_9fa48("106");
        const err = new Error(stryMutAct_9fa48("107") ? "" : (stryCov_9fa48("107"), 'Замовлення не знайдено або не має статусу "completed".'));
        err.statusCode = 404;
        throw err;
      }
    }
  }
};
export default stryMutAct_9fa48("108") ? {} : (stryCov_9fa48("108"), {
  getAllHistory,
  getPopularDishes,
  getAllActiveOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder
});