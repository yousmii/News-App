class RSSCounter:
    count = 0

    def __int__(self):
        pass

    def getCount(self):
        curr_count = RSSCounter.count
        RSSCounter.count += 1
        return curr_count