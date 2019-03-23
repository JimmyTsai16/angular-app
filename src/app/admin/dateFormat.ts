export class DateFormat {
  today = new Date();
  dd = this.today.getDate();

  mm = this.today.getMonth() + 1;
  yyyy = this.today.getFullYear();

  getNowFormat() { // Format "yyyy-MM-dd"

    if (this.dd < 10) {
      this.dd = +('0' + this.dd.toString());
    }

    if (this.mm < 10) {
      this.mm = +('0' + this.mm.toString());
    }

  }
}
export class CpuData {
  data: CpuInfo[];
  start: number;
  end: number;
}
export class CpuInfo {
  CreatedAt: any;
  CpuPercentage: number;
}
